-- Jalankan di Supabase: SQL Editor > New query > Run
create table if not exists public.berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 3 and 150),
  ringkasan text not null check (char_length(ringkasan) <= 400),
  tanggal date,
  dipublikasi boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.pendaftaran (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nama_wali text not null check (char_length(nama_wali) between 2 and 100),
  kontak text not null check (char_length(kontak) between 5 and 50),
  nama_calon text not null check (char_length(nama_calon) between 2 and 100),
  topik text not null check (topik in ('Jadwal','Persyaratan','Program','Lainnya')),
  setuju_privasi boolean not null check (setuju_privasi)
);
alter table public.berita enable row level security;
alter table public.pendaftaran enable row level security;

-- Pengunjung hanya boleh MEMBACA berita yang sudah dipublikasi
create policy "berita dibaca publik" on public.berita for select to anon using (dipublikasi);
-- Pengunjung hanya boleh MENGIRIM pendaftaran, tidak boleh membaca/ubah/hapus
create policy "pendaftaran dikirim publik" on public.pendaftaran for insert to anon with check (setuju_privasi);

grant select on public.berita to anon;
grant insert on public.pendaftaran to anon;
-- Baca data pendaftaran lewat Dashboard Supabase (Table Editor), bukan dari website.
