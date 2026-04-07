-- Routes: named walking routes with loci on a real map
create table routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  created_at timestamptz default now()
);

alter table routes enable row level security;
create policy "Users manage own routes" on routes
  for all using (auth.uid() = user_id);

create table route_loci (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade not null,
  position int not null,
  label text not null,
  lat double precision not null,
  lng double precision not null,
  timeframe text default '',
  event_text text default '',
  created_at timestamptz default now()
);

alter table route_loci enable row level security;
create policy "Users manage own route loci" on route_loci
  for all using (
    exists (select 1 from routes where routes.id = route_loci.route_id and routes.user_id = auth.uid())
  );
