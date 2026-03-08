import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search } from "lucide-react";

const statusMap = {
  pending: { label: "Ожидает обработки", icon: Clock, step: 0 },
  processing: { label: "В обработке", icon: Package, step: 1 },
  shipped: { label: "В пути", icon: Truck, step: 2 },
  delivered: { label: "Доставлен", icon: CheckCircle, step: 3 },
};

const steps = ["Ожидание", "Обработка", "В пути", "Доставлен"];

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [searchCode, setSearchCode] = useState(searchParams.get("code") || "");

  const order = orders.find((o) => o.trackingCode === searchCode);

  useEffect(() => {
    const c = searchParams.get("code");
    if (c) { setCode(c); setSearchCode(c); }
  }, [searchParams]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Отслеживание заказа</h1>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Введите код отслеживания (APL-XXXXX)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearchCode(code)}
        />
        <Button onClick={() => setSearchCode(code)} className="gap-1">
          <Search className="h-4 w-4" /> Найти
        </Button>
      </div>

      {searchCode && !order && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Заказ с кодом <strong>{searchCode}</strong> не найден</p>
        </div>
      )}

      {order && (
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Код отслеживания</p>
              <p className="font-mono font-bold text-lg">{order.trackingCode}</p>
            </div>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
              {statusMap[order.status].label}
            </Badge>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
              style={{ width: `${(statusMap[order.status].step / 3) * 100}%` }}
            />
            {steps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i <= statusMap[order.status].step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Получатель:</span> {order.customerName}</p>
            <p className="text-sm"><span className="text-muted-foreground">Адрес:</span> {order.address}</p>
            <p className="text-sm"><span className="text-muted-foreground">Дата заказа:</span> {new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Товары</h3>
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm py-1">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Итого</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
