import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/data/products";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  if (!product) return <div className="container mx-auto px-4 py-16 text-center">Товар не найден</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/category/${product.category}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
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

          <div className="flex items-center gap-2">
            <span className={`text-sm ${product.inStock > 0 ? "text-success" : "text-destructive"}`}>
              {product.inStock > 0 ? `В наличии: ${product.inStock} шт.` : "Нет в наличии"}
            </span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            <Button
              size="lg"
              onClick={() => addToCart(product)}
              disabled={product.inStock === 0}
              className="gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              В корзину
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
