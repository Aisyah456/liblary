<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'title' => 'Perpustakaan UMHT Resmi Buka Layanan Turnitin',
                'slug' => 'perpustakaan-umht-resmi-buka-layanan-turnitin',
                'category' => 'Pengumuman',
                'excerpt' => 'Mulai semester ini, mahasiswa dapat mengakses layanan cek plagiarisme Turnitin secara gratis melalui portal perpustakaan.',
                'body' => '<p>Perpustakaan Universitas MH Thamrin bekerja sama dengan pihak Turnitin menyediakan layanan cek similarity untuk tugas akhir dan karya ilmiah.</p><p>Mahasiswa dapat mengirim dokumen melalui menu <strong>Layanan → Turnitin</strong> dan menerima laporan dalam 1–3 hari kerja.</p>',
                'thumbnail' => null,
                'published_at' => now()->subDays(5),
                'is_published' => true,
                'is_featured' => true,
            ],
            [
                'title' => 'Jadwal Pelatihan Literasi Digital November 2025',
                'slug' => 'jadwal-pelatihan-literasi-digital-november-2025',
                'category' => 'Kegiatan',
                'excerpt' => 'Daftar sekarang untuk workshop Mendeley, penelusuran jurnal, dan penulisan sitasi yang akan digelar setiap Selasa dan Kamis.',
                'body' => '<p>Pelatihan literasi digital kembali dibuka untuk seluruh civitas akademika.</p><p>Materi meliputi: penggunaan Mendeley, penelusuran database jurnal, dan tata cara sitasi yang benar. Pendaftaran melalui link di menu <strong>Kegiatan</strong>.</p>',
                'thumbnail' => null,
                'published_at' => now()->subDays(12),
                'is_published' => true,
                'is_featured' => false,
            ],
            [
                'title' => 'Panduan Baru Pengurusan Bebas Pustaka Online',
                'slug' => 'panduan-baru-pengurusan-bebas-pustaka-online',
                'category' => 'Pengumuman',
                'excerpt' => 'Prosedur pengajuan surat bebas pustaka kini dapat dilakukan sepenuhnya secara daring melalui akun SSO mahasiswa.',
                'body' => '<p>Untuk mempercepat proses wisuda, pengurusan bebas pustaka tidak lagi memerlukan antre ke loket.</p><p>Langkah-langkah: Login SSO → Layanan → Bebas Pustaka → Isi form dan unggah bukti pengembalian buku. Sertifikat digital akan dikirim ke email.</p>',
                'thumbnail' => null,
                'published_at' => now()->subDays(20),
                'is_published' => true,
                'is_featured' => true,
            ],
        ];

        foreach ($items as $item) {
            // updateOrCreate(kriteria_pencarian, data_yang_diupdate)
            News::updateOrCreate(
                ['slug' => $item['slug']], // Cek apakah slug ini sudah ada
                $item // Jika ada diupdate, jika tidak ada dibuat baru
            );
        }
    }
}
