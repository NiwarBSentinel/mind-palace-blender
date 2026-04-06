-- User progress table for SRS data
CREATE TABLE user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  word text NOT NULL,
  level text NOT NULL,
  ease_factor float DEFAULT 2.5,
  interval integer DEFAULT 1,
  next_review timestamp DEFAULT now(),
  repetitions integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, word, level)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Add user_id to lernkarten (nullable for backwards compatibility)
ALTER TABLE lernkarten ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- RLS for lernkarten: users see their own cards + cards without user_id (shared)
CREATE POLICY "Users can view own or shared lernkarten" ON lernkarten
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own lernkarten" ON lernkarten
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update own lernkarten" ON lernkarten
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete own lernkarten" ON lernkarten
  FOR DELETE USING (user_id = auth.uid() OR user_id IS NULL);
