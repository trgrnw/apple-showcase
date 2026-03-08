
-- Products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_key TEXT NOT NULL,
  description TEXT NOT NULL,
  specs TEXT[] NOT NULL DEFAULT '{}',
  in_stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by anyone" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by anyone" ON public.products FOR UPDATE USING (true);

-- Orders table
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders are insertable by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by anyone" ON public.orders FOR UPDATE USING (true);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items are viewable by everyone" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Order items are insertable by anyone" ON public.order_items FOR INSERT WITH CHECK (true);

-- Supplies table
CREATE TABLE public.supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'in_transit', 'received')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Supplies are viewable by everyone" ON public.supplies FOR SELECT USING (true);
CREATE POLICY "Supplies are insertable by anyone" ON public.supplies FOR INSERT WITH CHECK (true);
CREATE POLICY "Supplies are updatable by anyone" ON public.supplies FOR UPDATE USING (true);
