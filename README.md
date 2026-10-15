# Aplikasi Kalkulator Modern (HTML, CSS, JavaScript)

Aplikasi kalkulator berbasis web yang responsif, modern, dan kaya fitur. Dirancang dengan antarmuka yang bersih (mendukung Mode Gelap & Terang), animasi interaktif, riwayat perhitungan, serta dukungan penuh untuk input keyboard fisik.

## 🚀 Fitur Utama

1. **Operasi Aritmatika Lengkap**:
   - Penjumlahan (`+`), Pengurangan (`−`), Perkalian (`×`), dan Pembagian (`÷`).
   - Persentase cerdas (`%`) yang mendukung persentase tunggal maupun persentase kalkulatif (contoh: `200 + 10% = 220`).
   - Tombol negasi (`±`) untuk mengubah tanda positif/negatif bilangan.
   - Penanganan pembagian dengan nol (`Tak terhingga`).
   - Pencegahan bug presisi desimal floating point (seperti `0.1 + 0.2 = 0.3`).

2. **Tampilan & UX Modern**:
   - **Mode Gelap (Dark Mode) & Terang (Light Mode)**: Tersedia tombol toggle tema yang statusnya tersimpan di `localStorage`.
   - **Format Angka Lokal (ID)**: Pemisah ribuan menggunakan titik (`.`) dan desimal menggunakan koma (`,`) agar ramah pengguna Indonesia.
   - **Responsif**: Tampilan tetap proporsional dan nyaman digunakan baik di layar desktop maupun perangkat mobile.
   - **Dynamic Font Scaling**: Ukuran teks angka pada layar otomatis menyesuaikan saat digit bertambah panjang agar tidak terpotong.

3. **Panel Riwayat Perhitungan (History)**:
   - Menyimpan daftar operasi perhitungan sebelumnya.
   - Riwayat tersimpan di `localStorage` peramban sehingga tidak hilang saat halaman dimuat ulang.
   - Pengguna dapat mengklik item riwayat untuk memuat kembali angka hasil ke layar kalkulator.
   - Tombol hapus riwayat sekali klik.

4. **Dukungan Penuh Keyboard**:
   - `0` - `9` : Input angka
   - `.` : Koma desimal
   - `+`, `-`, `*`, `/` : Operator matematika
   - `Enter` atau `=` : Hitung hasil
   - `Backspace` : Hapus satu karakter terakhir (DEL)
   - `Escape` : Bersihkan semua input (AC)
   - `%` : Persentase
   - `H` : Buka/tutup panel riwayat

---

## 📁 Struktur Berkas

```text
project-kalkulator/
│
├── index.html     # Struktur tampilan semantik dan layout kalkulator
├── tentang.html   # Informasi fitur dan cara menjalankan aplikasi
├── style.css      # Styling tampilan modern, tema dark/light, dan animasi
├── script.js      # Logika komputasi, event keyboard, tema, dan riwayat
└── README.md      # Dokumentasi proyek
```

---

## 💻 Cara Menjalankan

Karena proyek ini berbasis web standar (HTML, CSS, dan JavaScript vanila), Anda dapat menjalankannya dengan beberapa cara:

1. **Melalui Laragon / Web Server Lokal**:
   - Pastikan Laragon sedang berjalan (klik **Start All**).
   - Buka browser dan akses alamat:
     ```
     http://localhost/pwd-2026/project-kalkulator/
     ```

2. **Membuka Langsung (Direct File)**:
   - Cukup klik dua kali berkas `index.html` pada File Explorer untuk membukanya di browser apa pun (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).
