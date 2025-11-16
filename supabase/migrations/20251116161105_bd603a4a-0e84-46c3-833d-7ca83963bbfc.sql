-- Drop the overly permissive policies for videos
DROP POLICY IF EXISTS "Anyone can delete videos" ON public.videos;
DROP POLICY IF EXISTS "Anyone can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Anyone can update videos" ON public.videos;

-- Create admin-only policies for modifying videos
CREATE POLICY "Admins can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update videos"
ON public.videos
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete videos"
ON public.videos
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));