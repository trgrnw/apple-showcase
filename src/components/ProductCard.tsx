import { Link } from "react-router-dom";
import { DbProduct } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: DbProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group glass-card rounded-xl overflow-hidden hover-lift"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-secondary/50">
          <img
            src={getImageForProduct(product.image_key)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="h-8 gap-1"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="text-xs">В корзину</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
