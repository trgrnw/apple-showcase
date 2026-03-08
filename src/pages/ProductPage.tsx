import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, addFavorite, removeFavorite } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, ArrowLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, favoriteIds, toggleFavoriteLocal } = useStore();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/category/${product.category}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl overflow-hidden">
          <img src={getImageForProduct(product.image_key)} alt={product.name} className="w-full aspect-square object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.subcategory}</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{product.description}</p>
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
          <span className={`text-sm ${product.in_stock > 0 ? "text-success" : "text-destructive"}`}>
            {product.in_stock > 0 ? `В наличии: ${product.in_stock} шт.` : "Нет в наличии"}
          </span>
          <div className="flex items-center gap-4 pt-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            <Button size="lg" onClick={() => { addToCart(product); toast.success("Добавлено в корзину"); }} disabled={product.in_stock === 0} className="gap-2 bg-gradient-premium hover:opacity-90">
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
