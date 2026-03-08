import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { fetchFavorites, fetchProfile, updateProfile, fetchOrderByPhoneAndCode } from "@/lib/api";
import { getImageForProduct } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Package, Settings, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useStore();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";

  const [trackPhone, setTrackPhone] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const { data: favData = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user,
  });

  if (loading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Загрузка...</div>;
  if (!user) return <Navigate to="/auth" />;

  const handleTrackOrder = async () => {
    if (!trackPhone || !trackCode) { toast.error("Введите номер телефона и код заказа"); return; }
    setTrackLoading(true);
    try {
      const order = await fetchOrderByPhoneAndCode(trackPhone, trackCode);
      setTrackResult(order);
      if (!order) toast.error("Заказ не найден");
    } catch { toast.error("Ошибка поиска"); }
    finally { setTrackLoading(false); }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(user.id, {
        display_name: editName || profile?.display_name || "",
        phone: editPhone || profile?.phone || "",
      });
      toast.success("Профиль обновлён");
    } catch { toast.error("Ошибка сохранения"); }
  };

  const favoriteProducts = favData.map((f: any) => f.products).filter(Boolean);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="profile" className="gap-1"><Settings className="h-4 w-4" /> Профиль</TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1"><Heart className="h-4 w-4" /> Избранное</TabsTrigger>
          <TabsTrigger value="orders" className="gap-1"><Package className="h-4 w-4" /> Мои заказы</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Личные данные</h2>
            <Input
              placeholder="Имя"
              defaultValue={profile?.display_name || ""}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              placeholder="Телефон"
              defaultValue={profile?.phone || ""}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Email: {user.email}</p>
            <Button onClick={handleSaveProfile}>Сохранить</Button>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Тема интерфейса</h2>
            <div className="flex gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-1"
              >
                <Sun className="h-4 w-4" /> Светлая
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-1"
              >
                <Moon className="h-4 w-4" /> Тёмная
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Нет избранных товаров</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/">Перейти в каталог</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteProducts.map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} index={i} compact />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Search className="h-4 w-4" /> Отследить заказ</h2>
            <p className="text-sm text-muted-foreground">Введите номер телефона и код заказа</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input placeholder="Номер телефона *" value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} />
              <Input placeholder="Код заказа (DBR-XXXX) *" value={trackCode} onChange={(e) => setTrackCode(e.target.value)} />
              <Button onClick={handleTrackOrder} disabled={trackLoading}>
                {trackLoading ? "Поиск..." : "Найти"}
              </Button>
            </div>

            {trackResult && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{trackResult.tracking_code}</span>
                  <span className="text-sm capitalize bg-accent px-2 py-0.5 rounded">{trackResult.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">Сумма: {formatPrice(trackResult.total)}</p>
                <p className="text-sm text-muted-foreground">Адрес: {trackResult.address}</p>
                <p className="text-sm text-muted-foreground">Дата: {new Date(trackResult.created_at).toLocaleDateString("ru-RU")}</p>
              </div>
            )}

            {trackResult === null && trackCode && !trackLoading && (
              <p className="text-sm text-destructive">Заказ не найден. Проверьте номер телефона и код.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
