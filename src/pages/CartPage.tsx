import { useStore } from "@/store/useStore";
import { getImageForProduct } from "@/data/products";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Заполните обязательные поля: имя, телефон, адрес");
      return;
    }
    setLoading(true);
    try {
      const trackingCode = await createOrder(
        cart.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
        form,
        getCartTotal()
      );
      clearCart();
      toast.success(`Заказ оформлен! Код: ${trackingCode}`);
      navigate(`/track?code=${trackingCode}`);
    } catch (err) {
      toast.error("Ошибка при оформлении заказа");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Корзина пуста</h1>
        <p className="text-muted-foreground">Добавьте товары из каталога</p>
        <Button onClick={() => navigate("/")}>На главную</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="glass-card rounded-xl p-4 flex gap-4">
              <img src={getImageForProduct(item.product.image_key)} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                <p className="text-lg font-semibold mt-1">{formatPrice(item.product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive ml-auto" onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4 h-fit">
          <h2 className="font-semibold text-lg">Оформление заказа</h2>
          <Input placeholder="Имя *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Телефон *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Адрес доставки *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Товары ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span className="text-success">Бесплатно</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Итого</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleOrder} disabled={loading}>
            {loading ? "Оформляем..." : "Оформить заказ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
