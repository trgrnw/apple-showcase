-- Allow users to delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Make order_id nullable so reviews don't require a purchase
ALTER TABLE public.reviews ALTER COLUMN order_id DROP NOT NULL;
ALTER TABLE public.reviews ALTER COLUMN order_id SET DEFAULT '';