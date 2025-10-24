-- Update user_uploads RLS policy to allow anyone to view uploads
-- since the admin panel has its own password protection
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.user_uploads;

CREATE POLICY "Anyone can view uploads" 
ON public.user_uploads FOR SELECT 
USING (true);

CREATE POLICY "Users can view and insert their own uploads" 
ON public.user_uploads FOR INSERT 
WITH CHECK (auth.uid() = user_id);