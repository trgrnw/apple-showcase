import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogPage() {
  const { data: posts = [] } = useQuery({ queryKey: ["blog-posts"], queryFn: fetchBlogPosts });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Блог</h1>
        <p className="text-muted-foreground mb-8">Новости, обзоры и полезные статьи</p>
      </motion.div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Скоро здесь появятся статьи</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.slug}`} className="glass-card rounded-xl overflow-hidden hover-lift group block">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={getImageForProduct(post.image_key)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-primary mb-2">{new Date(post.created_at).toLocaleDateString("ru-RU")}</p>
                  <h2 className="font-semibold line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
