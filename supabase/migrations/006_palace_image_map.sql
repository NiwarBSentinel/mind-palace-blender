-- Palace image URL
alter table palaces add column if not exists image_url text default '';

-- Room markers on palace image
create table palace_markers (
  id uuid primary key default gen_random_uuid(),
  palace_id uuid references palaces(id) on delete cascade not null,
  room_index int not null,
  x_percent double precision not null,
  y_percent double precision not null
);

alter table palace_markers enable row level security;
create policy "Users manage own palace markers" on palace_markers
  for all using (
    exists (select 1 from palaces where palaces.id = palace_markers.palace_id)
  );
