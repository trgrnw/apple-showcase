import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPost } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Загрузка...</div>;
  if (!post) return <div className="container mx-auto px-4 py-16 text-center">Статья не найдена</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад к блогу
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="rounded-xl overflow-hidden">
          <img src={getImageForProduct(post.image_key)} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
        <p className="text-sm text-primary">{new Date(post.created_at).toLocaleDateString("ru-RU")}</p>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-foreground/80 leading-relaxed">{post.content}</p>
        </div>
      </motion.article>
    </div>
  );
}
