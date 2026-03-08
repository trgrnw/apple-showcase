import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchProductVariants, addFavorite, removeFavorite, ProductVariant } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, ArrowLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, favoriteIds, toggleFavoriteLocal } = useStore();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: variants = [] } = useQuery({
    queryKey: ["product-variants", id],
    queryFn: () => fetchProductVariants(id!),
    enabled: !!id,
  });

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");

  const hasVariants = variants.length > 0;

  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))], [variants]);
  const storages = useMemo(() => {
    const filtered = selectedColor
      ? variants.filter((v) => v.color === selectedColor)
      : variants;
    return [...new Set(filtered.map((v) => v.storage).filter(Boolean))];
  }, [variants, selectedColor]);

  // Auto-select first options
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
  }, [colors]);

  useEffect(() => {
    if (storages.length > 0 && !storages.includes(selectedStorage)) setSelectedStorage(storages[0]);
  }, [storages, selectedStorage]);

  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!hasVariants) return undefined;
    return variants.find(
      (v) => v.color === selectedColor && v.storage === selectedStorage
    ) || variants.find((v) => v.color === selectedColor) || variants[0];
  }, [variants, selectedColor, selectedStorage, hasVariants]);

  const displayPrice = activeVariant?.price ?? product?.price ?? 0;
  const displayStock = activeVariant?.in_stock ?? product?.in_stock ?? 0;
  const displayImageKey = activeVariant?.image_key || product?.image_key || "";

  const isFav = product ? favoriteIds.includes(product.id) : false;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleFavorite = async () => {
    if (!user) { toast.error("Войдите, чтобы добавить в избранное"); return; }
    if (!product) return;
    toggleFavoriteLocal(product.id);
    try {
      if (isFav) await removeFavorite(user.id, product.id);
      else await addFavorite(user.id, product.id);
    } catch {
      toggleFavoriteLocal(product.id);
      toast.error("Ошибка");
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Загрузка...</div>;
  if (!product) return <div className="container mx-auto px-4 py-16 text-center">Товар не найден</div>;

  const cartProduct = {
    ...product,
    price: displayPrice,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/category/${product.category}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl overflow-hidden">
          <img src={getImageForProduct(displayImageKey)} alt={product.name} className="w-full aspect-square object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.subcategory}</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{product.description}</p>

          {/* Variant Selectors */}
          {hasVariants && (
            <div className="space-y-5">
              {/* Color Selector */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Цвет: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Selector */}
              {storages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Память</h3>
                  <div className="flex flex-wrap gap-2">
                    {storages.map((storage) => {
                      const variant = variants.find(
                        (v) => v.color === selectedColor && v.storage === storage
                      );
                      return (
                        <button
                          key={storage}
                          onClick={() => setSelectedStorage(storage)}
                          className={`px-4 py-2.5 text-sm rounded-lg border transition-all flex flex-col items-center min-w-[80px] ${
                            selectedStorage === storage
                              ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-medium">{storage}</span>
                          {variant && (
                            <span className="text-xs mt-0.5">{formatPrice(variant.price)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">Характеристики</h3>
            <div className="flex flex-wrap gap-2">
              {product.specs.map((spec) => (
                <Badge key={spec} variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" /> {spec}
                </Badge>
              ))}
            </div>
          </div>
          <span className={`text-sm ${displayStock > 0 ? "text-success" : "text-destructive"}`}>
            {displayStock > 0 ? `В наличии: ${displayStock} шт.` : "Нет в наличии"}
          </span>
          <div className="flex items-center gap-4 pt-4">
            <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
            <Button size="lg" onClick={() => { addToCart(cartProduct); toast.success("Добавлено в корзину"); }} disabled={displayStock === 0} className="gap-2 bg-gradient-premium hover:opacity-90">
              <ShoppingCart className="h-5 w-5" /> В корзину
            </Button>
            <Button size="lg" variant="outline" onClick={handleFavorite} className="gap-2">
              <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
