-- Missing RLS Policies for SejongPulse

-- 1. Profiles
-- Allow users to update their own profile fields
CREATE POLICY "Users can update their own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- 2. Pulses
-- Allow users to update pulses (e.g. for likes_count or soft deletes)
CREATE POLICY "Users can update pulses" ON pulses 
FOR UPDATE USING (true);

-- 3. Comments
-- Allow users to delete their own comments if they ever need to
CREATE POLICY "Users can delete own comments" ON comments 
FOR DELETE USING (auth.uid() = author_id);
