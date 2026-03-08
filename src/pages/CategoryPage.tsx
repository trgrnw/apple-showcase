import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categories } from "@/data/products";
import { fetchProductsByCategory } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const category = categories.find((c) => c.id === id);
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const sub = searchParams.get("sub");
    if (sub) setActiveSubcat(sub);
  }, [searchParams]);

  const { data: products = [] } = useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => fetchProductsByCategory(id!),
    enabled: !!id,
  });

  if (!category) return <div className="container mx-auto px-4 py-16 text-center">Категория не найдена</div>;

  const filtered = products.filter((p) => {
    if (activeSubcat && p.subcategory !== activeSubcat) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (inStockOnly && p.in_stock <= 0) return false;
    return true;
  });

  const maxPrice = Math.max(...products.map((p) => p.price), 300000);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Подкатегория</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveSubcat(null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${!activeSubcat ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
          >
            Все
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${activeSubcat === sub ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Цена</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          min={0}
          max={maxPrice}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded" />
          Только в наличии
        </label>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <Button variant="outline" size="sm" className="lg:hidden gap-1" onClick={() => setFiltersOpen(!filtersOpen)}>
          <SlidersHorizontal className="h-4 w-4" /> Фильтры
        </Button>
      </div>

      {/* Mobile filters */}
      {filtersOpen && (
        <div className="lg:hidden glass-card rounded-xl p-4 mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">Фильтры</span>
            <button onClick={() => setFiltersOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <Filters />
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="glass-card rounded-xl p-4 sticky top-20">
            <h2 className="font-semibold text-sm mb-4">Фильтры</h2>
            <Filters />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">Найдено: {filtered.length}</p>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Товары не найдены. Попробуйте изменить фильтры.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
