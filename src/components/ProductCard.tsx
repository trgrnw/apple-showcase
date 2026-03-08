import { Link } from "react-router-dom";
import { DbProduct } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { addFavorite, removeFavorite } from "@/lib/api";
import { toast } from "sonner";

interface ProductCardProps {
  product: DbProduct;
  index?: number;
  compact?: boolean;
}

export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const { addToCart, favoriteIds, toggleFavoriteLocal } = useStore();
  const { user } = useAuth();
  const isFav = favoriteIds.includes(product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Войдите, чтобы добавить в избранное"); return; }
    toggleFavoriteLocal(product.id);
    try {
      if (isFav) await removeFavorite(user.id, product.id);
      else await addFavorite(user.id, product.id);
    } catch {
      toggleFavoriteLocal(product.id); // rollback
      toast.error("Ошибка");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group glass-card rounded-xl overflow-hidden hover-lift relative"
    >
      <button
        onClick={handleFavorite}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all"
      >
        <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
      </button>

      <Link to={`/product/${product.id}`}>
        <div className={`${compact ? "aspect-[4/3]" : "aspect-square"} overflow-hidden bg-secondary/50`}>
          <img
            src={getImageForProduct(product.image_key)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className={`${compact ? "p-3" : "p-4"} space-y-1.5`}>
        <Link to={`/product/${product.id}`}>
          <h3 className={`font-medium ${compact ? "text-xs" : "text-sm"} leading-tight hover:text-primary transition-colors line-clamp-2`}>
            {product.name}
          </h3>
        </Link>
        {!compact && <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>}
        <div className="flex items-center justify-between pt-1">
          <span className={`${compact ? "text-sm" : "text-base"} font-semibold`}>{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={(e) => { e.preventDefault(); addToCart(product); toast.success("Добавлено в корзину"); }}
            className={`${compact ? "h-7 text-[10px] px-2" : "h-8 text-xs"} gap-1`}
          >
            <ShoppingCart className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
            В корзину
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
