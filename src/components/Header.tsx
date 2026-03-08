import { Link } from "react-router-dom";
import { ShoppingCart, Sun, Moon, Menu, X, Search, Shield, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { categories } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { cart, theme, toggleTheme } = useStore();
  const { user, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          <span className="text-gradient">Apple</span> Store
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {categories.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/track" className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartCount}
              </Badge>
            )}
          </Link>

          {user && isAdmin ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors">
                <Shield className="h-5 w-5" />
              </Link>
              <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
              <Shield className="h-5 w-5" />
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          {categories.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              {c.name}
            </Link>
          ))}
          {user && isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-primary">Админ-панель</Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="block text-sm text-muted-foreground hover:text-foreground">Выйти</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Вход для админа</Link>
          )}
        </div>
      )}
    </header>
  );
}
