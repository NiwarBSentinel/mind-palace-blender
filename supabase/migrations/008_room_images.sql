-- Add image_url to rooms
alter table rooms add column if not exists image_url text default '';

-- Room markers: loci positions on room images
create table if not exists room_markers (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade,
  locus_id uuid references loci(id) on delete cascade,
  x_percent float not null,
  y_percent float not null,
  created_at timestamptz default now()
);

alter table room_markers enable row level security;

create policy "Anyone can manage room_markers" on room_markers
  for all using (true) with check (true);
