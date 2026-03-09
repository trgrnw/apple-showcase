import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categories } from "@/data/products";
import { fetchProductsByCategory } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const category = categories.find((c) => c.id === id);
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  // priceRange = применённый фильтр (влияет на список)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  // priceRangeDraft = текущее значение при перетаскивании (не трогает список)
  const [priceRangeDraft, setPriceRangeDraft] = useState<[number, number]>([0, 500000]);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  useEffect(() => {
    const sub = searchParams.get("sub");
    if (sub) setActiveSubcat(sub);
  }, [searchParams]);

  const { data: products = [] } = useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => fetchProductsByCategory(id!),
    enabled: !!id,
  });

  const maxPrice = Math.max(...products.map((p) => p.price), 500000);

  // Инициализируем/нормализуем значения после загрузки товаров
  useEffect(() => {
    if (!products.length) return;

    const clampRange = (prev: [number, number]) => {
      const nextMax = maxPrice;
      const nextMin = Math.max(0, Math.min(prev[0], nextMax));
      const nextHigh = Math.max(nextMin, Math.min(prev[1], nextMax));
      return [nextMin, nextHigh] as [number, number];
    };

    setPriceRange((prev) => clampRange(prev));
    setPriceRangeDraft((prev) => clampRange(prev));

    setMinInput((v) => (v === "" ? "0" : v));
    setMaxInput((v) => (v === "" ? String(maxPrice) : v));
  }, [maxPrice, products.length]);

  const handleSliderChange = (v: number[]) => {
    setPriceRangeDraft(v as [number, number]);
  };

  const handleSliderCommit = (v: number[]) => {
    const next = v as [number, number];
    setPriceRange(next);
    setPriceRangeDraft(next);
    setMinInput(next[0].toString());
    setMaxInput(next[1].toString());
  };

  if (!category)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Категория не найдена
      </div>
    );

  const handleMinBlur = () => {
    const val = parseInt(minInput) || 0;
    const clamped = Math.max(0, Math.min(val, priceRange[1]));
    const next: [number, number] = [clamped, priceRange[1]];
    setPriceRange(next);
    setPriceRangeDraft(next);
    setMinInput(clamped.toString());
  };

  const handleMaxBlur = () => {
    const val = parseInt(maxInput) || maxPrice;
    const clamped = Math.max(priceRange[0], Math.min(val, maxPrice));
    const next: [number, number] = [priceRange[0], clamped];
    setPriceRange(next);
    setPriceRangeDraft(next);
    setMaxInput(clamped.toString());
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (activeSubcat && p.subcategory !== activeSubcat) return false;
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        if (inStockOnly && p.in_stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, activeSubcat, priceRange, inStockOnly, sortBy]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Подкатегория</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveSubcat(null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !activeSubcat ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            Все
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeSubcat === sub
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Цена</h3>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            placeholder="От"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMinBlur()}
            className="h-8 text-xs"
          />
          <Input
            type="number"
            placeholder="До"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMaxBlur()}
            className="h-8 text-xs"
          />
        </div>
        <Slider
          value={priceRangeDraft}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          min={0}
          max={maxPrice}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRangeDraft[0])}</span>
          <span>{formatPrice(priceRangeDraft[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Сортировка</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full h-8 text-xs rounded-md border border-border bg-background px-2"
        >
          <option value="name">По названию</option>
          <option value="price-asc">Сначала дешёвые</option>
          <option value="price-desc">Сначала дорогие</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded"
          />
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
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="glass-card rounded-xl p-4 sticky top-20">
            <h2 className="font-semibold text-sm mb-4">Фильтры</h2>
            <Filters />
          </div>
        </aside>

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
