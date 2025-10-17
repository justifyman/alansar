-- Create hero table for managing hero section
CREATE TABLE public.hero (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'The Last Guardian',
  description TEXT NOT NULL DEFAULT 'In a world torn by war, one warrior stands between chaos and salvation.',
  background_image_url TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hero" ON public.hero FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update hero" ON public.hero FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete hero" ON public.hero FOR DELETE USING (true);

-- Insert default hero data
INSERT INTO public.hero (title, description, background_image_url) 
VALUES (
  'The Last Guardian',
  'In a world torn by war, one warrior stands between chaos and salvation. An epic tale of courage, sacrifice, and redemption that will keep you on the edge of your seat.',
  '/src/assets/hero-featured.jpg'
);