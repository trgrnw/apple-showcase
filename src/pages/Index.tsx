import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categories, getImageForProduct } from "@/data/products";
import { fetchProducts, fetchBlogPosts, fetchPromotions } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { ArrowRight, Percent, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: blogPosts = [] } = useQuery({ queryKey: ["blog-posts"], queryFn: fetchBlogPosts });
  const { data: promotions = [] } = useQuery({ queryKey: ["promotions"], queryFn: fetchPromotions });

  // Top sellers — first 6 products with highest stock (proxy for popularity)
  const topSellers = [...products].sort((a, b) => b.in_stock - a.in_stock).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="text-gradient">Debry</span>
              <span className="text-muted-foreground">:</span>Store
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Оригинальная техника Apple с гарантией. Бесплатная доставка по всей России.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild size="lg" className="bg-gradient-premium hover:opacity-90">
                <Link to="/category/iphone">Каталог</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/track">Отследить заказ</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories with grayscale hover */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/category/${cat.id}`} className="block rounded-xl overflow-hidden relative group hover-lift">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover grayscale-hover group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-sm font-semibold">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center gap-2 mb-8">
            <Percent className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Акции</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((promo: any) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden group hover-lift"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={getImageForProduct(promo.image_key)}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs font-bold bg-gradient-premium text-primary-foreground px-2 py-0.5 rounded">
                    -{promo.discount_percent}%
                  </span>
                  <h3 className="font-semibold mt-2">{promo.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{promo.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Top Sellers */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Топ продаж</h2>
          </div>
          <Link to="/category/iphone" className="text-primary flex items-center gap-1 text-sm hover:gap-2 transition-all">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} compact />
          ))}
        </div>
      </section>

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Блог</h2>
            </div>
            <Link to="/blog" className="text-primary flex items-center gap-1 text-sm hover:gap-2 transition-all">
              Все статьи <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogPosts.slice(0, 4).map((post: any) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="glass-card rounded-xl overflow-hidden hover-lift group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={getImageForProduct(post.image_key)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-primary mt-2">{new Date(post.created_at).toLocaleDateString("ru-RU")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
