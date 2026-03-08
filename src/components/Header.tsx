import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Heart, User, Shield, LogOut, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { categories } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchProducts, DbProduct } from "@/lib/api";

export function Header() {
  const { cart, favoriteIds } = useStore();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [tappedCat, setTappedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DbProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout>();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    if (searchQuery.trim() === "/admin") {
      navigate("/admin");
      setSearchQuery("");
      setSearchOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setSearchOpen(true);
      } catch { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      setTappedCat(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleCatEnter = (catId: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setHoveredCat(catId);
  };

  const handleCatLeave = () => {
    dropdownTimeout.current = setTimeout(() => setHoveredCat(null), 200);
  };

  const handleCatClick = (e: React.MouseEvent, catId: string) => {
    // On touch devices, toggle dropdown instead of navigating
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (tappedCat !== catId) {
        e.preventDefault();
        e.stopPropagation();
        setTappedCat(catId);
      }
    }
  };

  const isDropdownOpen = (catId: string) => hoveredCat === catId || tappedCat === catId;

  return (
    <>
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight shrink-0">
          <span className="text-gradient">Debry</span>
          <span className="text-muted-foreground">:</span>Store
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {categories.map((c) => (
            <div
              key={c.id}
              className="relative"
              onMouseEnter={() => handleCatEnter(c.id)}
              onMouseLeave={handleCatLeave}
            >
              <Link
                to={`/category/${c.id}`}
                onClick={(e) => handleCatClick(e, c.id)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
              >
                {c.name}
                <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen(c.id) ? "rotate-180" : ""}`} />
              </Link>
              {isDropdownOpen(c.id) && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 glass-card rounded-lg border shadow-lg p-2 animate-slide-down z-50"
                  onMouseEnter={() => handleCatEnter(c.id)}
                  onMouseLeave={handleCatLeave}
                >
                  {c.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/category/${c.id}?sub=${encodeURIComponent(sub)}`}
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                      onClick={() => { setHoveredCat(null); setTappedCat(null); }}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/faq" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
            FAQ
          </Link>
        </nav>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            className="w-full h-9 rounded-lg bg-secondary/80 border-0 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg border shadow-lg max-h-80 overflow-y-auto z-50">
              {searchResults.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors p-2">
                <User className="h-5 w-5" />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors p-2">
                  <Shield className="h-5 w-5" />
                </Link>
              )}
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button size="sm" variant="outline" className="gap-1 h-8">
                <User className="h-4 w-4" /> Войти
              </Button>
            </Link>
          )}

          {user && (
            <Link to="/profile?tab=favorites" className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
              <Heart className={`h-5 w-5 ${favoriteIds.length > 0 ? "fill-primary text-primary" : ""}`} />
              {favoriteIds.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {favoriteIds.length}
                </Badge>
              )}
            </Link>
          )}

          <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>

          {user && (
            <button onClick={signOut} className="hidden md:block text-muted-foreground hover:text-foreground transition-colors p-2">
              <LogOut className="h-5 w-5" />
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-muted-foreground p-2">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile menu - outside header to avoid backdrop-filter containing block */}
    {menuOpen && (
      <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-[60] border-t bg-background overflow-y-auto overscroll-contain touch-auto">
        <div className="p-4 space-y-2">
        {/* Mobile search */}
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 rounded-lg bg-secondary/80 border-0 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
        />
        {categories.map((c) => (
          <MobileCategoryItem key={c.id} category={c} onClose={() => setMenuOpen(false)} />
        ))}
        <Link to="/faq" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium hover:text-foreground">FAQ</Link>
        <div className="border-t pt-2 mt-2">
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm">Профиль</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-primary">Админ-панель</Link>}
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="block px-3 py-2 text-sm text-muted-foreground w-full text-left">Выйти</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-primary">Войти / Регистрация</Link>
          )}
        </div>
        </div>
      </div>
    )}
    </>
  );
}

function MobileCategoryItem({ category, onClose }: { category: { id: string; name: string; subcategories: string[] }; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:text-foreground"
      >
        {category.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pl-6 space-y-1 animate-slide-down">
          <Link
            to={`/category/${category.id}`}
            onClick={onClose}
            className="block px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Все {category.name}
          </Link>
          {category.subcategories.map((sub) => (
            <Link
              key={sub}
              to={`/category/${category.id}?sub=${encodeURIComponent(sub)}`}
              onClick={onClose}
              className="block px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {sub}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
