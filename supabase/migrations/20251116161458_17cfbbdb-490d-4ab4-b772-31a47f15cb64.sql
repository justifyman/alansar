-- Drop the overly permissive policies for hero table
DROP POLICY IF EXISTS "Anyone can delete hero" ON public.hero;
DROP POLICY IF EXISTS "Anyone can insert hero" ON public.hero;
DROP POLICY IF EXISTS "Anyone can update hero" ON public.hero;

-- Create admin-only policies for modifying hero content
CREATE POLICY "Admins can insert hero"
ON public.hero
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero"
ON public.hero
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero"
ON public.hero
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));