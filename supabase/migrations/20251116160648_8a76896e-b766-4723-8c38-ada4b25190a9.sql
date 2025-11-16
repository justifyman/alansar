-- Drop the overly permissive policies for categories
DROP POLICY IF EXISTS "Anyone can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON public.categories;

-- Create admin-only policies for modifying categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));