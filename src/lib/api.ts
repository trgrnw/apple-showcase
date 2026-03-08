import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type DbProduct = Tables<"products">;
export type DbOrder = Tables<"orders">;
export type DbOrderItem = Tables<"order_items">;
export type DbSupply = Tables<"supplies">;

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  storage: string;
  price: number;
  in_stock: number;
  image_key: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  text: string;
  author_name: string;
  created_at: string;
}

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

export async function fetchProductVariants(productId: string): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("price");
  if (error) throw error;
  return (data || []) as unknown as ProductVariant[];
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase.from("products").select("*").or(`name.ilike.%${query}%,description.ilike.%${query}%`).order("name").limit(20);
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

export async function fetchOrderByPhoneAndCode(phone: string, trackingCode: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("tracking_code", trackingCode).eq("customer_phone", phone).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchOrderItems(orderId: string) {
  const { data, error } = await supabase.from("order_items").select("*, products(*)").eq("order_id", orderId);
  if (error) throw error;
  return data;
}

export async function fetchUserOrders(email: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("customer_email", email).order("created_at", { ascending: false });
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
  const trackingCode = `DBR-${generateId()}`;

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

// Favorites
export async function fetchFavorites(userId: string) {
  const { data, error } = await supabase.from("favorites").select("*, products(*)").eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, productId: string) {
  const { error } = await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
  if (error && error.code !== "23505") throw error;
}

export async function removeFavorite(userId: string, productId: string) {
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}

export async function fetchUserFavoriteIds(userId: string) {
  const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
  if (error) throw error;
  return (data || []).map((f: any) => f.product_id);
}

// Blog
export async function fetchBlogPosts() {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBlogPost(slug: string) {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  return data;
}

// Promotions
export async function fetchPromotions() {
  const { data, error } = await supabase.from("promotions").select("*").eq("active", true);
  if (error) throw error;
  return data;
}

// Profile
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { display_name?: string; phone?: string }) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}

// Reviews
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Review[];
}

export async function createReview(review: {
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  text: string;
  author_name: string;
}) {
  const { error } = await supabase.from("reviews").insert(review);
  if (error) throw error;
}

export async function checkUserCanReview(userId: string, productId: string): Promise<{ canReview: boolean; orderId: string | null }> {
  // Check if user has ordered this product
  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select("order_id, orders!order_items_order_id_fkey(customer_email)")
    .eq("product_id", productId);
  if (error) return { canReview: false, orderId: null };

  // Get user email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { canReview: false, orderId: null };

  const matchingItem = (orderItems || []).find((item: any) =>
    item.orders?.customer_email === user.email
  );

  if (!matchingItem) return { canReview: false, orderId: null };

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingReview) return { canReview: false, orderId: null };

  return { canReview: true, orderId: matchingItem.order_id };
}
