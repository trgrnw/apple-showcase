import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductById, fetchProductVariants, fetchProductReviews,
  addFavorite, removeFavorite, createReview, deleteReview,
  ProductVariant, Review,
} from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Check, ArrowLeft, Heart, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect, useMemo, useRef } from "react";

// Detailed specs per product category prefix
const detailedSpecs: Record<string, Record<string, Record<string, string | string[]>>> = {
  "iphone-16-pro-max": {
    "Основные характеристики": {
      "Серия": "iPhone 16 Pro Max",
      "SIM-карта": "SIM + eSIM",
      "Операционная система": "iOS 18",
      "Процессор": "Apple A18 Pro",
    },
    "Корпус": {
      "Материал": "титан",
      "Высота, мм": "163",
      "Ширина, мм": "77.6",
      "Толщина, мм": "8.25",
      "Вес, г": "227",
    },
    "Дисплей": {
      "Диагональ": "6,9''",
      "Разрешение": "2868x1320",
      "Яркость": "2000 нит",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "до 120 Гц (ProMotion)",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 48 Мп + 12 Мп",
      "Тип объектива": ["основной", "сверхширокоугольный", "телефото"],
      "Оптический зум": "5x",
      "Стабилизация": "оптическая стабилизация со сдвигом матрицы",
    },
    "Связь и подключение": {
      "Сотовая сеть": ["5G (sub‑6 GHz)", "Gigabit Class LTE", "GSM/EDGE"],
      "Wi-Fi": "Wi-Fi 7 (802.11be)",
      "Bluetooth": "5.3",
      "NFC": "Да",
      "Разъём": "USB Type-C",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Face ID": "Да",
      "MagSafe": "Да",
      "Кнопка Action": "Да",
    },
  },
  "iphone-16-pro": {
    "Основные характеристики": {
      "Серия": "iPhone 16 Pro",
      "SIM-карта": "SIM + eSIM",
      "Операционная система": "iOS 18",
      "Процессор": "Apple A18 Pro",
    },
    "Корпус": {
      "Материал": "титан",
      "Высота, мм": "149.6",
      "Ширина, мм": "71.5",
      "Толщина, мм": "8.25",
      "Вес, г": "199",
    },
    "Дисплей": {
      "Диагональ": "6,3''",
      "Разрешение": "2622x1206",
      "Яркость": "2000 нит",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "до 120 Гц (ProMotion)",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 48 Мп + 12 Мп",
      "Тип объектива": ["основной", "сверхширокоугольный", "телефото"],
      "Оптический зум": "5x",
    },
    "Связь и подключение": {
      "Wi-Fi": "Wi-Fi 7 (802.11be)",
      "Bluetooth": "5.3",
      "Разъём": "USB Type-C",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Face ID": "Да",
      "MagSafe": "Да",
    },
  },
  "iphone-16-plus": {
    "Основные характеристики": {
      "Серия": "iPhone 16 Plus",
      "SIM-карта": "SIM + eSIM",
      "Операционная система": "iOS 18",
      "Процессор": "Apple A18",
    },
    "Дисплей": {
      "Диагональ": "6,7''",
      "Разрешение": "2796x1290",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "60 Гц",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп",
      "Тип объектива": ["основной", "сверхширокоугольный"],
    },
    "Связь и подключение": {
      "Wi-Fi": "Wi-Fi 7",
      "Bluetooth": "5.3",
      "Разъём": "USB Type-C",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Face ID": "Да",
      "MagSafe": "Да",
    },
  },
  "iphone-16": {
    "Основные характеристики": {
      "Серия": "iPhone 16",
      "SIM-карта": "SIM + eSIM",
      "Операционная система": "iOS 18",
      "Процессор": "Apple A18",
    },
    "Дисплей": {
      "Диагональ": "6,1''",
      "Разрешение": "2556x1179",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "60 Гц",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп",
    },
    "Связь и подключение": {
      "Wi-Fi": "Wi-Fi 7",
      "Bluetooth": "5.3",
      "Разъём": "USB Type-C",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Face ID": "Да",
      "MagSafe": "Да",
    },
  },
  "iphone-15-pro-max": {
    "Основные характеристики": {
      "Серия": "iPhone 15 Pro Max",
      "Процессор": "Apple A17 Pro",
      "Операционная система": "iOS 17",
    },
    "Дисплей": {
      "Диагональ": "6,7''",
      "Разрешение": "2796x1290",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "до 120 Гц (ProMotion)",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп + 12 Мп",
      "Оптический зум": "5x",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Разъём": "USB Type-C",
    },
  },
  "iphone-15-pro": {
    "Основные характеристики": {
      "Серия": "iPhone 15 Pro",
      "Процессор": "Apple A17 Pro",
      "Операционная система": "iOS 17",
    },
    "Дисплей": {
      "Диагональ": "6,1''",
      "Тип дисплея": "Super Retina XDR",
      "Частота обновления": "до 120 Гц (ProMotion)",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп + 12 Мп",
      "Оптический зум": "3x",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Разъём": "USB Type-C",
    },
  },
  "iphone-15-plus": {
    "Основные характеристики": {
      "Серия": "iPhone 15 Plus",
      "Процессор": "Apple A16 Bionic",
      "Операционная система": "iOS 17",
    },
    "Дисплей": {
      "Диагональ": "6,7''",
      "Тип дисплея": "Super Retina XDR",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Разъём": "USB Type-C",
    },
  },
  "iphone-15": {
    "Основные характеристики": {
      "Серия": "iPhone 15",
      "Процессор": "Apple A16 Bionic",
      "Операционная система": "iOS 17",
    },
    "Дисплей": {
      "Диагональ": "6,1''",
      "Тип дисплея": "Super Retina XDR",
    },
    "Камера": {
      "Разрешение камеры": "48 Мп + 12 Мп",
    },
    "Дополнительно": {
      "Защита от воды": "IP68",
      "Разъём": "USB Type-C",
    },
  },
};

const tabs = [
  { id: "description", label: "Описание" },
  { id: "specs", label: "Характеристики" },
  { id: "accessories", label: "Аксессуары" },
  { id: "reviews", label: "Отзывы" },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, favoriteIds, toggleFavoriteLocal } = useStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: variants = [] } = useQuery({
    queryKey: ["product-variants", id],
    queryFn: () => fetchProductVariants(id!),
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: () => fetchProductReviews(id!),
    enabled: !!id,
  });

  const { data: canReviewData } = useQuery({
    queryKey: ["can-review", id, user?.id],
    queryFn: () => checkUserCanReview(user!.id, id!),
    enabled: !!id && !!user,
  });

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  const hasVariants = variants.length > 0;

  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))], [variants]);
  const storages = useMemo(() => {
    const filtered = selectedColor ? variants.filter((v) => v.color === selectedColor) : variants;
    return [...new Set(filtered.map((v) => v.storage).filter(Boolean))];
  }, [variants, selectedColor]);

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
  }, [colors]);

  useEffect(() => {
    if (storages.length > 0 && !storages.includes(selectedStorage)) setSelectedStorage(storages[0]);
  }, [storages, selectedStorage]);

  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!hasVariants) return undefined;
    return variants.find((v) => v.color === selectedColor && v.storage === selectedStorage)
      || variants.find((v) => v.color === selectedColor)
      || variants[0];
  }, [variants, selectedColor, selectedStorage, hasVariants]);

  const displayPrice = activeVariant?.price ?? product?.price ?? 0;
  const displayStock = activeVariant?.in_stock ?? product?.in_stock ?? 0;
  const displayImageKey = activeVariant?.image_key || product?.image_key || "";

  const isFav = product ? favoriteIds.includes(product.id) : false;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleFavorite = async () => {
    if (!user) { toast.error("Войдите, чтобы добавить в избранное"); return; }
    if (!product) return;
    toggleFavoriteLocal(product.id);
    try {
      if (isFav) await removeFavorite(user.id, product.id);
      else await addFavorite(user.id, product.id);
    } catch {
      toggleFavoriteLocal(product.id);
      toast.error("Ошибка");
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !product || !canReviewData?.orderId || !reviewText.trim()) return;
    setSubmitting(true);
    try {
      const profile = await import("@/lib/api").then(m => m.fetchProfile(user.id));
      await createReview({
        product_id: product.id,
        user_id: user.id,
        order_id: canReviewData.orderId,
        rating: reviewRating,
        text: reviewText.trim(),
        author_name: profile?.display_name || user.email || "Покупатель",
      });
      toast.success("Отзыв отправлен!");
      setReviewText("");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["can-review", id, user.id] });
    } catch {
      toast.error("Ошибка при отправке отзыва");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    tabContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Загрузка...</div>;
  if (!product) return <div className="container mx-auto px-4 py-16 text-center">Товар не найден</div>;

  const cartProduct = { ...product, price: displayPrice };
  const productSpecs = detailedSpecs[product.id] || detailedSpecs[product.image_key] || null;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/category/${product.category}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl overflow-hidden">
          <img src={getImageForProduct(displayImageKey)} alt={product.name} className="w-full aspect-square object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.subcategory}</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            {avgRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{avgRating} ({reviews.length} отзывов)</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-lg">{product.description}</p>

          {hasVariants && (
            <div className="space-y-5">
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Цвет: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {storages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Память</h3>
                  <div className="flex flex-wrap gap-2">
                    {storages.map((storage) => {
                      const variant = variants.find((v) => v.color === selectedColor && v.storage === storage);
                      return (
                        <button
                          key={storage}
                          onClick={() => setSelectedStorage(storage)}
                          className={`px-4 py-2.5 text-sm rounded-lg border transition-all flex flex-col items-center min-w-[80px] ${
                            selectedStorage === storage
                              ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-medium">{storage}</span>
                          {variant && <span className="text-xs mt-0.5">{formatPrice(variant.price)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <span className={`text-sm block ${displayStock > 0 ? "text-green-500" : "text-destructive"}`}>
            {displayStock > 0 ? `В наличии: ${displayStock} шт.` : "Нет в наличии"}
          </span>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
            <Button size="lg" onClick={() => { addToCart(cartProduct); toast.success("Добавлено в корзину"); }} disabled={displayStock === 0} className="gap-2 bg-gradient-premium hover:opacity-90">
              <ShoppingCart className="h-5 w-5" /> В корзину
            </Button>
            <Button size="lg" variant="outline" onClick={handleFavorite} className="gap-2">
              <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-border mb-0 sticky top-14 bg-background/95 backdrop-blur-sm z-20">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
              {tab.id === "reviews" && reviews.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">({reviews.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div ref={tabContentRef} className="py-8">
        {/* Description */}
        {activeTab === "description" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-4">
            <h2 className="text-2xl font-bold mb-4">Описание</h2>
            <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {product.specs.map((spec) => (
                <Badge key={spec} variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" /> {spec}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specs */}
        {activeTab === "specs" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
            {productSpecs ? (
              <div className="space-y-8">
                {Object.entries(productSpecs).map(([section, specs]) => (
                  <div key={section}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{section}</h3>
                    <div className="glass-card rounded-xl overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(specs).map(([key, value], i) => (
                            <tr key={key} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                              <td className="px-4 py-2.5 text-sm text-muted-foreground w-1/2 align-top">{key}</td>
                              <td className="px-4 py-2.5 text-sm text-foreground">
                                {Array.isArray(value) ? (
                                  <ul className="space-y-0.5">
                                    {value.map((v, j) => (
                                      <li key={j} className="flex items-start gap-1.5">
                                        <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                        {v}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  value
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground mb-4">Основные характеристики</p>
                <div className="flex flex-wrap gap-2">
                  {product.specs.map((spec) => (
                    <Badge key={spec} variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" /> {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Accessories */}
        {activeTab === "accessories" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Рекомендуемые аксессуары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Чехол MagSafe", desc: "Оригинальный силиконовый чехол с поддержкой MagSafe", price: "от 4 990 ₽", img: "cases" },
                { name: "Зарядное устройство MagSafe", desc: "Беспроводная зарядка 15 Вт", price: "от 3 990 ₽", img: "charger" },
                { name: "AirPods Pro", desc: "Наушники с активным шумоподавлением", price: "от 19 990 ₽", img: "airpods-pro" },
                { name: "Защитное стекло", desc: "Керамическое стекло с олеофобным покрытием", price: "от 1 490 ₽", img: "accessories" },
              ].map((acc) => (
                <div key={acc.name} className="glass-card rounded-xl p-4 flex gap-4 items-center">
                  <img src={getImageForProduct(acc.img)} alt={acc.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{acc.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{acc.desc}</p>
                    <p className="text-sm font-semibold mt-1">{acc.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Отзывы</h2>

            {/* Write review form */}
            {user && canReviewData?.canReview && (
              <div className="glass-card rounded-xl p-5 mb-6 space-y-4">
                <h3 className="font-semibold">Оставить отзыв</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star className={`h-6 w-6 transition-colors ${s <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Расскажите о вашем опыте использования..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSubmitReview} disabled={submitting || !reviewText.trim()} size="sm">
                  {submitting ? "Отправка..." : "Отправить отзыв"}
                </Button>
              </div>
            )}

            {!user && (
              <p className="text-sm text-muted-foreground mb-6">
                <Link to="/auth" className="text-primary hover:underline">Войдите</Link>, чтобы оставить отзыв (доступно после покупки товара).
              </p>
            )}

            {user && canReviewData && !canReviewData.canReview && (
              <p className="text-sm text-muted-foreground mb-6">
                Отзыв можно оставить после покупки данного товара.
              </p>
            )}

            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Пока нет отзывов. Будьте первым!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="glass-card rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.author_name}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
