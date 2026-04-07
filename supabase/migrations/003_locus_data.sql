CREATE TABLE locus_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  palace_id text NOT NULL,
  locus_id text NOT NULL,
  info text DEFAULT '',
  peg_nummer text DEFAULT '',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, palace_id, locus_id)
);

ALTER TABLE locus_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own locus data" ON locus_data
  FOR ALL USING (auth.uid() = user_id);
