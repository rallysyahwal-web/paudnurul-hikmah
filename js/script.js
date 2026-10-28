/* ===== PENGATURAN (edit di sini) ===== */
const CONFIG = {
  SUPABASE_AKTIF: false, // ubah ke true HANYA setelah sekolah setuju + kebijakan privasi siap
  SUPABASE_URL: "https://cxdvywnwneybrifesokg.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZHZ5d253bmV5YnJpZmVzb2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzA0OTMsImV4cCI6MjEwODc0NjQ5M30.GXkQd2gvrZ0zstInmOOj-ZQjYJi5fCH4-J6uPbCWcAM"
};
const DEMO_BERITA = [
  {judul:"Contoh: Pengumuman kegiatan sekolah", ringkasan:"Teks contoh untuk memperlihatkan tata letak kartu berita.", tanggal:"[Tanggal contoh]"},
  {judul:"Contoh: Informasi untuk orang tua", ringkasan:"Ganti dengan pengumuman asli dari sekolah.", tanggal:"[Tanggal contoh]"}
];
const $ = (id) => document.getElementById(id);

/* Menu HP */
const menuBtn = $("menuBtn"), nav = $("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
}
if ($("year")) $("year").textContent = new Date().getFullYear();

/* Galeri */
const viewer = $("viewer");
if (viewer) {
  document.querySelectorAll(".tile").forEach((t) => t.addEventListener("click", () => {
    $("viewerArt").className = "viewer-art " + t.classList[1];
    $("viewerCaption").textContent = t.dataset.caption;
    viewer.showModal();
  }));
  $("viewerClose").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
}

/* Berita */
function esc(s) { const d = document.createElement("div"); d.textContent = s ?? ""; return d.innerHTML; }
function renderBerita(items, demo) {
  const box = $("newsList");
  $("newsNote").textContent = demo ? "Contoh berita demo, bukan pengumuman resmi." : "";
  if (!items.length) { box.innerHTML = '<div class="card empty"><h3>Belum ada berita</h3><p>Pengumuman sekolah akan tampil di sini.</p></div>'; return; }
  box.innerHTML = items.map((b) => `<article class="card">${demo ? '<span class="tag">Contoh</span>' : ""}<p class="note">${esc(b.tanggal)}</p><h3>${esc(b.judul)}</h3><p>${esc(b.ringkasan)}</p></article>`).join("");
}
async function loadBerita() {
  if (!CONFIG.SUPABASE_AKTIF) return renderBerita(DEMO_BERITA, true);
  try {
    const r = await fetch(CONFIG.SUPABASE_URL + "/rest/v1/berita?select=judul,ringkasan,tanggal&order=tanggal.desc&limit=6",
      {headers: {apikey: CONFIG.SUPABASE_ANON_KEY, Authorization: "Bearer " + CONFIG.SUPABASE_ANON_KEY}});
    if (!r.ok) throw new Error(r.status);
    renderBerita(await r.json(), false);
  } catch (e) {
    $("newsList").innerHTML = '<div class="card empty"><h3>Berita belum bisa dimuat</h3><p>Coba muat ulang halaman nanti.</p></div>';
  }
}
loadBerita();

/* Formulir */
const form = $("regForm"), msg = $("formMsg");
function fail(text, id) { msg.textContent = text; $(id).focus(); }
if (form) {
  $("modeNote").textContent = CONFIG.SUPABASE_AKTIF
    ? "Data akan dikirim ke penyimpanan sekolah."
    : "Mode simulasi: formulir ini belum mengirim atau menyimpan data apa pun. Gunakan data dummy.";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "error";
    const v = (n) => form.elements[n].value.trim();
    if (v("nama_wali").length < 2) return fail("Isi nama orang tua atau wali (minimal 2 huruf).", "namaWali");
    if (v("kontak").length < 5) return fail("Isi kontak yang bisa dihubungi.", "kontak");
    if (v("nama_calon").length < 2) return fail("Isi nama calon peserta didik.", "namaCalon");
    if (!v("topik")) return fail("Pilih informasi yang ingin ditanyakan.", "topik");
    if (!form.elements.setuju_privasi.checked) return fail("Centang persetujuan untuk melanjutkan.", "setuju");
    if (!CONFIG.SUPABASE_AKTIF) { msg.className = "ok"; msg.textContent = "Simulasi berhasil. Tidak ada data yang dikirim atau disimpan."; form.reset(); return; }
    try {
      const r = await fetch(CONFIG.SUPABASE_URL + "/rest/v1/pendaftaran", {
        method: "POST",
        headers: {apikey: CONFIG.SUPABASE_ANON_KEY, Authorization: "Bearer " + CONFIG.SUPABASE_ANON_KEY, "Content-Type": "application/json", Prefer: "return=minimal"},
        body: JSON.stringify({nama_wali: v("nama_wali"), kontak: v("kontak"), nama_calon: v("nama_calon"), topik: v("topik"), setuju_privasi: true})
      });
      if (!r.ok) throw new Error(r.status);
      msg.className = "ok"; msg.textContent = "Permintaan terkirim. Sekolah akan menghubungi Anda."; form.reset();
    } catch (err) { msg.textContent = "Gagal mengirim. Periksa koneksi lalu coba lagi."; }
  });
}
