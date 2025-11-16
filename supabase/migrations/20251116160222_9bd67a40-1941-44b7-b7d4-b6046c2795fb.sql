-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view uploads" ON public.user_uploads;

-- Create policy for viewing approved uploads publicly
CREATE POLICY "Public can view approved uploads"
ON public.user_uploads
FOR SELECT
USING (status = 'approved');

-- Create policy for users to view their own uploads
CREATE POLICY "Users can view their own uploads"
ON public.user_uploads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for admins to view all uploads
CREATE POLICY "Admins can view all uploads"
ON public.user_uploads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));