CREATE TABLE custom_palaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  beschreibung text,
  emoji text DEFAULT '🏛️',
  raeume jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now()
);

ALTER TABLE custom_palaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own palaces" ON custom_palaces
  FOR ALL USING (auth.uid() = user_id);
