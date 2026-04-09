-- Supabase seed script for "Las Achiras" Project

-- Create table "lotes"
create table public.lotes (
  id_lote text primary key,
  estado text check (estado in ('disponible', 'no disponible', 'reservado')) not null,
  precio numeric,
  superficie text,
  link_whatsapp text
);

-- Enable Row Level Security (RLS)
alter table public.lotes enable row level security;

-- Create policy for public read access
create policy "Lotes son visibles publicamente"
  on public.lotes for select
  using ( true );

-- Insert dummy data for some sample IDs exact to Figma export
insert into public.lotes (id_lote, estado, precio, superficie, link_whatsapp) values
  ('lotes', 'disponible', 15000, '300m2', 'https://wa.me/1234567890'),
  ('lotes_2', 'no disponible', 18000, '350m2', 'https://wa.me/1234567890'),
  ('lotes_3', 'reservado', 16000, '310m2', 'https://wa.me/1234567890');
