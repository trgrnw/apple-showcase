import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;

export interface CartItem {
  product: DbProduct;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  theme: "light" | "dark";
  favoriteIds: string[];
  addToCart: (product: DbProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setFavoriteIds: (ids: string[]) => void;
  toggleFavoriteLocal: (id: string) => void;
  getCartTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      theme: "dark",
      favoriteIds: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((i) => i.product.id !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((i) => i.product.id !== productId)
            : state.cart.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
              ),
        })),

      clearCart: () => set({ cart: [] }),

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      setFavoriteIds: (ids) => set({ favoriteIds: ids }),
      toggleFavoriteLocal: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((fid) => fid !== id)
            : [...state.favoriteIds, id],
        })),

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },
    }),
    { name: "debry-store" }
  )
);
