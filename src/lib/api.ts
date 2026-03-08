import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;
export type DbOrder = Tables<"orders">;
export type DbOrderItem = Tables<"order_items">;
export type DbSupply = Tables<"supplies">;

// Products
export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function fetchProductsByCategory(category: string) {
  const { data, error } = await supabase.from("products").select("*").eq("category", category).order("name");
  if (error) throw error;
  return data;
}

export async function fetchProductsBySubcategory(category: string, subcategory: string) {
  const { data, error } = await supabase.from("products").select("*").eq("category", category).eq("subcategory", subcategory).order("name");
  if (error) throw error;
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Orders
export async function fetchOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchOrderByTrackingCode(trackingCode: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("tracking_code", trackingCode).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchOrderItems(orderId: string) {
  const { data, error } = await supabase.from("order_items").select("*, products(*)").eq("order_id", orderId);
  if (error) throw error;
  return data;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export async function createOrder(
  items: { productId: string; quantity: number; price: number }[],
  customer: { name: string; phone: string; email: string; address: string },
  total: number
) {
  const id = generateId();
  const trackingCode = `APL-${generateId()}`;

  const { error: orderErr } = await supabase.from("orders").insert({
    id,
    tracking_code: trackingCode,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_email: customer.email || null,
    address: customer.address,
    total,
    status: "pending",
  });
  if (orderErr) throw orderErr;

  const { error: itemsErr } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: id,
      product_id: i.productId,
      quantity: i.quantity,
      price: i.price,
    }))
  );
  if (itemsErr) throw itemsErr;

  return trackingCode;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

// Supplies
export async function fetchSupplies() {
  const { data, error } = await supabase.from("supplies").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSupply(supply: { product_id: string; product_name: string; quantity: number; supplier: string }) {
  const { error } = await supabase.from("supplies").insert({ ...supply, status: "ordered" });
  if (error) throw error;
}

export async function updateSupplyStatus(id: string, status: string) {
  const { error } = await supabase.from("supplies").update({ status }).eq("id", id);
  if (error) throw error;
}
