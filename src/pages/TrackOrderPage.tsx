import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderByTrackingCode, fetchOrderItems } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";

const statusMap: Record<string, { label: string; step: number; color: string }> = {
  pending: { label: "Ожидает обработки", step: 0, color: "secondary" },
  processing: { label: "В обработке", step: 1, color: "secondary" },
  shipped: { label: "В пути", step: 2, color: "default" },
  delivered: { label: "Доставлен", step: 3, color: "default" },
};

const steps = ["Ожидание", "Обработка", "В пути", "Доставлен"];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [searchCode, setSearchCode] = useState(searchParams.get("code") || "");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const c = searchParams.get("code");
    if (c) { setCode(c); setSearchCode(c); }
  }, [searchParams]);

  const { data: order } = useQuery({
    queryKey: ["order", searchCode],
    queryFn: () => fetchOrderByTrackingCode(searchCode),
    enabled: !!searchCode,
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ["orderItems", order?.id],
    queryFn: () => fetchOrderItems(order!.id),
    enabled: !!order?.id,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const currentStep = order ? (statusMap[order.status]?.step ?? 0) : 0;

  const showOrder = order && (filterStatus === "all" || order.status === filterStatus);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Отслеживание заказа</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Введите код отслеживания (DBR-XXXXX)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearchCode(code)}
        />
        <Button onClick={() => setSearchCode(code)} className="gap-1">
          <Search className="h-4 w-4" /> Найти
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" /> Фильтр по статусу
        </Button>
        {filterStatus !== "all" && (
          <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterStatus("all")}>
            {statusMap[filterStatus]?.label} <X className="h-3 w-3" />
          </Badge>
        )}
      </div>

      {filtersOpen && (
        <div className="glass-card rounded-xl p-4 mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Статус заказа</span>
            <button onClick={() => setFiltersOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setFilterStatus("all"); setFiltersOpen(false); }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${filterStatus === "all" ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 text-muted-foreground"}`}
            >
              Все
            </button>
            {Object.entries(statusMap).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setFilterStatus(key); setFiltersOpen(false); }}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${filterStatus === key ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 text-muted-foreground"}`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchCode && !order && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Заказ с кодом <strong>{searchCode}</strong> не найден</p>
        </div>
      )}

      {order && !showOrder && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Заказ найден, но не соответствует выбранному фильтру</p>
        </div>
      )}

      {showOrder && (
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Код отслеживания</p>
              <p className="font-mono font-bold text-lg">{order.tracking_code}</p>
            </div>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
              {statusMap[order.status]?.label || order.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
            <div className="absolute top-4 left-0 h-0.5 bg-primary transition-all" style={{ width: `${(currentStep / 3) * 100}%` }} />
            {steps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i <= currentStep ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Получатель:</span> {order.customer_name}</p>
            <p className="text-sm"><span className="text-muted-foreground">Адрес:</span> {order.address}</p>
            <p className="text-sm"><span className="text-muted-foreground">Дата:</span> {new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
          </div>

          {orderItems.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Товары</h3>
              {orderItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span>{item.products?.name || item.product_id} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Итого</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
