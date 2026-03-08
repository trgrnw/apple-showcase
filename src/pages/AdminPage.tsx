import { useStore, Order, SupplyItem } from "@/store/useStore";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { Package, Truck, ClipboardList, Plus } from "lucide-react";

const statusLabels: Record<Order["status"], string> = {
  pending: "Ожидает",
  processing: "Обработка",
  shipped: "Отправлен",
  delivered: "Доставлен",
};

const supplyStatusLabels: Record<SupplyItem["status"], string> = {
  ordered: "Заказано",
  in_transit: "В пути",
  received: "Получено",
};

export default function AdminPage() {
  const { orders, supplies, updateOrderStatus, addSupply, updateSupplyStatus } = useStore();
  const [supplyForm, setSupplyForm] = useState({ productId: "", quantity: "", supplier: "" });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleAddSupply = () => {
    if (!supplyForm.productId || !supplyForm.quantity || !supplyForm.supplier) {
      toast.error("Заполните все поля");
      return;
    }
    const product = products.find((p) => p.id === supplyForm.productId);
    addSupply({
      productId: supplyForm.productId,
      productName: product?.name || "",
      quantity: parseInt(supplyForm.quantity),
      supplier: supplyForm.supplier,
      status: "ordered",
    });
    setSupplyForm({ productId: "", quantity: "", supplier: "" });
    toast.success("Поставка добавлена");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>

      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="gap-1">
            <ClipboardList className="h-4 w-4" /> Заказы ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="supplies" className="gap-1">
            <Truck className="h-4 w-4" /> Поставки ({supplies.length})
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1">
            <Package className="h-4 w-4" /> Склад
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">Заказов пока нет</p>
          ) : (
            [...orders].reverse().map((order) => (
              <div key={order.id} className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm text-muted-foreground">#{order.id}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="font-mono text-sm">{order.trackingCode}</span>
                  </div>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Клиент:</span> {order.customerName} • {order.customerPhone}</p>
                  <p><span className="text-muted-foreground">Адрес:</span> {order.address}</p>
                  <p><span className="text-muted-foreground">Сумма:</span> {formatPrice(order.total)}</p>
                  <p><span className="text-muted-foreground">Товары:</span> {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  {(["pending", "processing", "shipped", "delivered"] as Order["status"][]).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={order.status === s ? "default" : "outline"}
                      onClick={() => {
                        updateOrderStatus(order.id, s);
                        toast.success(`Статус обновлён: ${statusLabels[s]}`);
                      }}
                    >
                      {statusLabels[s]}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Supplies */}
        <TabsContent value="supplies" className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Новая поставка</h3>
            <div className="grid sm:grid-cols-4 gap-3">
              <Select value={supplyForm.productId} onValueChange={(v) => setSupplyForm({ ...supplyForm, productId: v })}>
                <SelectTrigger><SelectValue placeholder="Товар" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Кол-во" value={supplyForm.quantity} onChange={(e) => setSupplyForm({ ...supplyForm, quantity: e.target.value })} />
              <Input placeholder="Поставщик" value={supplyForm.supplier} onChange={(e) => setSupplyForm({ ...supplyForm, supplier: e.target.value })} />
              <Button onClick={handleAddSupply}>Добавить</Button>
            </div>
          </div>

          {supplies.length === 0 ? (
            <p className="text-muted-foreground">Поставок пока нет</p>
          ) : (
            [...supplies].reverse().map((supply, idx) => {
              const realIdx = supplies.length - 1 - idx;
              return (
                <div key={realIdx} className="glass-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{supply.productName}</p>
                    <p className="text-xs text-muted-foreground">Кол-во: {supply.quantity} • Поставщик: {supply.supplier} • {new Date(supply.date).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="flex gap-2">
                    {(["ordered", "in_transit", "received"] as SupplyItem["status"][]).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={supply.status === s ? "default" : "outline"}
                        onClick={() => {
                          updateSupplyStatus(realIdx, s);
                          toast.success(`Статус поставки: ${supplyStatusLabels[s]}`);
                        }}
                      >
                        {supplyStatusLabels[s]}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Inventory */}
        <TabsContent value="inventory">
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Товар</th>
                  <th className="text-left p-3 font-medium">Категория</th>
                  <th className="text-right p-3 font-medium">Цена</th>
                  <th className="text-right p-3 font-medium">На складе</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.subcategory}</td>
                    <td className="p-3 text-right">{formatPrice(p.price)}</td>
                    <td className="p-3 text-right">
                      <Badge variant={p.inStock > 10 ? "default" : "secondary"}>
                        {p.inStock} шт.
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
