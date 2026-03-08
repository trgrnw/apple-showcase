import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categories } from "@/data/products";
import { fetchProductsByCategory, fetchProductsBySubcategory } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => fetchProductsByCategory(id!),
    enabled: !!id && !activeSubcat,
  });

  const { data: subcatProducts = [] } = useQuery({
    queryKey: ["products", "category", id, "subcategory", activeSubcat],
    queryFn: () => fetchProductsBySubcategory(id!, activeSubcat!),
    enabled: !!id && !!activeSubcat,
  });

  if (!category) return <div className="container mx-auto px-4 py-16 text-center">Категория не найдена</div>;

  const items = activeSubcat ? subcatProducts : allProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant={activeSubcat === null ? "default" : "outline"} size="sm" onClick={() => setActiveSubcat(null)}>
          Все
        </Button>
        {category.subcategories.map((sub) => (
          <Button key={sub} variant={activeSubcat === sub ? "default" : "outline"} size="sm" onClick={() => setActiveSubcat(sub)}>
            {sub}
          </Button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Товары в этой подкатегории скоро появятся.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
