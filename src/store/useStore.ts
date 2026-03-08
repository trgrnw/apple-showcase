import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  trackingCode: string;
}

export interface SupplyItem {
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  supplier: string;
  status: "ordered" | "in_transit" | "received";
}

interface StoreState {
  cart: CartItem[];
  orders: Order[];
  supplies: SupplyItem[];
  theme: "light" | "dark";
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string; phone: string; email: string; address: string }) => string;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addSupply: (supply: Omit<SupplyItem, "date">) => void;
  updateSupplyStatus: (index: number, status: SupplyItem["status"]) => void;
  toggleTheme: () => void;
  getCartTotal: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      supplies: [],
      theme: "dark",

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

      placeOrder: (customer) => {
        const state = get();
        const trackingCode = `APL-${generateId()}`;
        const order: Order = {
          id: generateId(),
          items: [...state.cart],
          total: state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
          status: "pending",
          createdAt: new Date().toISOString(),
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          address: customer.address,
          trackingCode,
        };
        set({ orders: [...state.orders, order], cart: [] });
        return trackingCode;
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),

      addSupply: (supply) =>
        set((state) => ({
          supplies: [...state.supplies, { ...supply, date: new Date().toISOString() }],
        })),

      updateSupplyStatus: (index, status) =>
        set((state) => ({
          supplies: state.supplies.map((s, i) => (i === index ? { ...s, status } : s)),
        })),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },
    }),
    { name: "apple-store" }
  )
);
