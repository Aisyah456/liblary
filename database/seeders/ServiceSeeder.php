<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Nonaktifkan foreign key check agar bisa melakukan truncate tanpa error
        Schema::disableForeignKeyConstraints();
        DB::table('services')->truncate();
        Schema::enableForeignKeyConstraints();

        DB::table('services')->insert([
            [
                'icon' => 'book-open',
                'title' => 'Sirkulasi & Peminjaman',
                'subtitle' => 'Layanan peminjaman dan pengembalian koleksi fisik.',
                'description' => 'Akses mudah untuk peminjaman buku teks, referensi, dan literatur akademik dengan sistem otomasi yang terintegrasi.',
                'features' => json_encode([
                    'Peminjaman hingga 10 eksemplar',
                    'Masa pinjam 14 hari (Mahasiswa)',
                    'Sistem denda transparan',
                    'Booking buku via aplikasi'
                ]),
                'link' => '/sirkulasi',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'icon' => 'monitor',
                'title' => 'E-Resources & Journal',
                'subtitle' => 'Akses jurnal internasional dan database digital.',
                'description' => 'Koneksi ke berbagai database jurnal ternama (ScienceDirect, Springer, ProQuest) dan koleksi e-book langganan universitas.',
                'features' => json_encode([
                    'Akses Full-Text Jurnal',
                    'Database E-Book Internasional',
                    'Akses dari luar kampus (VPN/Proxy)',
                    'Panduan sitasi otomatis'
                ]),
                'link' => '/e-resources',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'icon' => 'shield-check',
                'title' => 'Cek Plagiarisme (Turnitin)',
                'subtitle' => 'Verifikasi orisinalitas karya ilmiah.',
                'description' => 'Layanan pemeriksaan tingkat kesamaan (similarity) untuk skripsi, tesis, dan artikel ilmiah menggunakan software Turnitin.',
                'features' => json_encode([
                    'Laporan orisinalitas detail',
                    'Panduan penurunan persentase',
                    'Sertifikat bukti cek Turnitin',
                    'Proses cepat (1-2 hari kerja)'
                ]),
                'link' => '/cek-turnitin',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'icon' => 'file-check',
                'title' => 'Bebas Pustaka',
                'subtitle' => 'Syarat kelulusan dan pengambilan ijazah.',
                'description' => 'Layanan pengurusan surat keterangan bebas pinjaman pustaka sebagai syarat yudisium dan kelulusan mahasiswa.',
                'features' => json_encode([
                    'Pengajuan secara online',
                    'Validasi sumbangan buku',
                    'Unggah mandiri karya akhir',
                    'E-Certificate Bebas Pustaka'
                ]),
                'link' => '/pustakas',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'icon' => 'archive',
                'title' => 'Repository Institusi',
                'subtitle' => 'Arsip digital karya ilmiah sivitas akademika.',
                'description' => 'Pusat penyimpanan digital untuk hasil riset, skripsi, tesis, dan disertasi yang dihasilkan oleh seluruh mahasiswa dan dosen.',
                'features' => json_encode([
                    'Pencarian metadata canggih',
                    'Open Access untuk publik',
                    'Statistik unduhan penulis',
                    'Integrasi dengan RAMA/SINTA'
                ]),
                'link' => '/repository',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'icon' => 'coffee',
                'title' => 'Ruang Baca & Co-Working',
                'subtitle' => 'Fasilitas belajar mandiri dan kolaborasi.',
                'description' => 'Penyediaan area belajar yang kondusif, mulai dari area tenang (Silent Zone) hingga ruang diskusi kelompok.',
                'features' => json_encode([
                    'High-speed WiFi',
                    'Charging Station di setiap meja',
                    'Ruang Diskusi (Booking)',
                    'Area lesehan & sofa nyaman'
                ]),
                'link' => '/ruang-baca',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
