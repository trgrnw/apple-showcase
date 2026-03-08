import { Link } from "react-router-dom";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="border-t bg-card/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-gradient">Debry</span>
              <span className="text-muted-foreground">:</span>Store
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Оригинальная техника Apple с гарантией. Бесплатная доставка по всей России.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Каталог</h4>
            <div className="space-y-2">
              {categories.map((c) => (
                <Link key={c.id} to={`/category/${c.id}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Информация</h4>
            <div className="space-y-2">
              <Link to="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Блог</Link>
              <Link to="/track" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Отследить заказ</Link>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Контакты</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>+7 (800) 555-35-35</p>
              <p>info@debrystore.ru</p>
              <p>Пн-Пт: 10:00 — 20:00</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Debry:Store. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
