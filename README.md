# PAUD Nurul Hikmah (Demo)
Website statis: HTML + CSS + JavaScript. Tanpa build.

## Jalankan di Linux Mint
Klik dua kali `index.html` (buka dengan Firefox). Uji tampilan HP: Firefox, tekan Ctrl+Shift+M.

## Edit
- Teks: buka `index.html` di Mousepad, cari teks dalam [kurung siku] lalu ganti.
- Warna: `css/style.css`, bagian `:root` paling atas.
- Berita contoh & saklar Supabase: `js/script.js`, bagian `CONFIG` paling atas.
- Gambar: taruh di `assets/images/`, lalu pakai `<img src="assets/images/nama.jpg" alt="..." loading="lazy">`.

## Supabase (opsional, mati secara default)
1. Jalankan `supabase/setup.sql` di SQL Editor Supabase.
2. Isi berita lewat Table Editor, centang `dipublikasi`.
3. Ubah `SUPABASE_AKTIF` jadi `true` di `js/script.js` HANYA setelah sekolah setuju dan kebijakan privasi siap.
Key `anon` memang boleh ada di frontend, aman selama RLS aktif. Jangan pernah pakai key `service_role` di website.

## Publikasi gratis
- Netlify: app.netlify.com/drop, seret folder `paud-nurul-hikmah`.
- GitHub Pages: unggah isi folder ke repo, lalu Settings > Pages > Deploy from branch (main, root).

## Wajib dikonfirmasi sekolah sebelum publikasi
Alamat, telepon, email, WhatsApp, visi misi, NPSN, akreditasi, program, biaya, jadwal, berkas, foto (dengan izin), logo resmi, kebijakan privasi.
