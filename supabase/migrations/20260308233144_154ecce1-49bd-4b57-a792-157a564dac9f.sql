
-- Trigger to auto-update product stock when supply status changes to 'received'
CREATE OR REPLACE FUNCTION public.handle_supply_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'received' AND (OLD.status IS NULL OR OLD.status <> 'received') THEN
    UPDATE public.products
    SET in_stock = in_stock + NEW.quantity
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_supply_received
  AFTER UPDATE ON public.supplies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_supply_received();
