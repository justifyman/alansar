-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and videos
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view videos"
ON public.videos FOR SELECT
USING (true);

-- Storage policies for public access
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Anyone can upload (we'll validate with admin password in frontend)
CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anyone can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails');

-- Anyone can update/delete (admin validation in frontend)
CREATE POLICY "Anyone can update videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can update thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thumbnails');

CREATE POLICY "Anyone can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails');

-- Admin can manage categories
CREATE POLICY "Anyone can insert categories"
ON public.categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
ON public.categories FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete categories"
ON public.categories FOR DELETE
USING (true);

-- Admin can manage videos
CREATE POLICY "Anyone can insert videos"
ON public.videos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update videos"
ON public.videos FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete videos"
ON public.videos FOR DELETE
USING (true);