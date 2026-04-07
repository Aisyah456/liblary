<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Revolusi Literasi: Peresmian Smart Library Hub 2026',
                'category' => 'Berita Utama',
                'excerpt' => 'Fasilitas baru dengan integrasi AI untuk pencarian buku dan ruang diskusi imersif kini hadir.',
                'content' => 'Perpustakaan pusat dengan bangga mengumumkan pembukaan Smart Library Hub yang dilengkapi dengan teknologi terkini...',
                'image_keyword' => 'future-library', // Keyword untuk gambar
                'reading_time' => 8,
                'is_featured' => true,
                'views' => 1250,
            ],
            [
                'title' => 'Workshop Penulisan Jurnal Scopus Q1',
                'category' => 'Akademik',
                'excerpt' => 'Strategi jitu menembus jurnal internasional bereputasi tinggi bagi peneliti muda.',
                'content' => 'Dalam upaya meningkatkan output penelitian, kami mengadakan workshop intensif yang menghadirkan reviewer jurnal ternama...',
                'image_keyword' => 'writing',
                'reading_time' => 5,
                'is_featured' => false,
                'views' => 840,
            ],
            [
                'title' => 'Hibah 1.000 Buku Langka Abad ke-18',
                'category' => 'Koleksi',
                'excerpt' => 'Koleksi sejarah berharga dari era kolonial kini tersedia untuk penelitian terbatas.',
                'content' => 'Pihak keluarga kolektor ternama telah menghibahkan ribuan buku bersejarah yang mencakup catatan perjalanan dan peta kuno...',
                'image_keyword' => 'old-books',
                'reading_time' => 6,
                'is_featured' => false,
                'views' => 420,
            ],
            [
                'title' => 'Malam Sastra: Bedah Buku Penulis Nasional',
                'category' => 'Event',
                'excerpt' => 'Diskusi mendalam bersama peraih penghargaan sastra tahun ini di aula perpustakaan.',
                'content' => 'Acara ini akan dihadiri oleh berbagai tokoh literasi nasional untuk membedah karya sastra terbaru yang kontroversial...',
                'image_keyword' => 'literature',
                'reading_time' => 4,
                'is_featured' => false,
                'views' => 670,
            ],
            [
                'title' => 'Update Sistem Peminjaman Mandiri (Self-Check)',
                'category' => 'Layanan',
                'excerpt' => 'Proses peminjaman kini lebih cepat menggunakan teknologi RFID terbaru.',
                'content' => 'Mulai hari ini, anggota perpustakaan tidak perlu mengantri di meja sirkulasi berkat sistem self-check yang baru diinstal...',
                'image_keyword' => 'technology',
                'reading_time' => 3,
                'is_featured' => false,
                'views' => 310,
            ],
        ];

        foreach ($articles as $article) {
            $slug = Str::slug($article['title']);

            // Mencegah error Duplicate Entry
            Article::updateOrCreate(
                ['slug' => $slug], // Cek berdasarkan slug
                [
                    'title'        => $article['title'],
                    'category'     => $article['category'],
                    'excerpt'      => $article['excerpt'],
                    'content'      => $article['content'],
                    // Menggunakan Picsum karena Unsplash source terkadang redirect/lambat
                    'thumbnail'    => "https://picsum.photos/seed/" . $slug . "/800/600",
                    'reading_time' => $article['reading_time'],
                    'is_featured'  => $article['is_featured'],
                    'views'        => $article['views'],
                    'created_at'   => Carbon::now()->subDays(rand(1, 20)),
                    'updated_at'   => Carbon::now(),
                ]
            );
        }
    }
}
