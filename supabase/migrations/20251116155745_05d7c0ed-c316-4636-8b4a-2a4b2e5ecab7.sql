-- Drop the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Anyone can view user roles" ON public.user_roles;

-- Create a new policy that restricts access to authenticated users only
CREATE POLICY "Authenticated users can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);