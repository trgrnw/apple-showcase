import { Link } from "react-router-dom";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const featured = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Apple Products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center space-y-6 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Apple</span> Store
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Оригинальная техника Apple с гарантией. Бесплатная доставка по всей России.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/category/iphone">Каталог</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/track">Отследить заказ</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/category/${cat.id}`}
                className="glass-card rounded-xl overflow-hidden block hover-lift group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Популярное</h2>
          <Link to="/category/iphone" className="text-primary flex items-center gap-1 text-sm hover:gap-2 transition-all">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
