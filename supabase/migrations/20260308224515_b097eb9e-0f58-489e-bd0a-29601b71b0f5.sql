
-- Create product_variants table
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL DEFAULT '',
  storage text NOT NULL DEFAULT '',
  price integer NOT NULL,
  in_stock integer NOT NULL DEFAULT 0,
  image_key text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update iPhone subcategories
UPDATE products SET subcategory = 'iPhone 15' WHERE id IN ('iphone-15', 'iphone-15-128-blue', 'ip15-128', 'iphone-15-plus');
UPDATE products SET subcategory = 'iPhone 15 Pro' WHERE id IN ('iphone-15-pro-256', 'ip15pro-256', 'ip15pro-512', 'iphone-15-pro-max-1tb');
