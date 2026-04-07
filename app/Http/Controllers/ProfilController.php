<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index(Request $request)
    {
        // Data Dummy untuk mensimulasikan database
        $newsData = [
            [
                'id' => 1,
                'title' => 'Visi dan Misi Baru Perpustakaan UMHT 2026',
                'slug' => 'visi-misi-baru-2026',
                'thumbnail' => 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000',
                'category' => 'INTERNAL',
                'excerpt' => 'Perpustakaan UMHT menetapkan langkah strategis baru untuk menjadi pusat riset digital terdepan.',
                'body' => 'Isi konten lengkap visi dan misi...',
                'published_at' => now()->toDateTimeString(),
                'is_featured' => true,
                'author_id' => 1,
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
            [
                'id' => 2,
                'title' => 'Peningkatan Fasilitas Ruang Baca Digital',
                'slug' => 'fasilitas-ruang-baca-digital',
                'thumbnail' => 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000',
                'category' => 'FASILITAS',
                'excerpt' => 'Kini tersedia 20 unit komputer baru dengan akses jurnal internasional premium.',
                'body' => 'Isi konten fasilitas...',
                'published_at' => now()->subDays(2)->toDateTimeString(),
                'is_featured' => false,
                'author_id' => 1,
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ],
        ];

        // Struktur yang sesuai dengan format Pagination (Props news.data)
        $news = [
            'data' => $newsData,
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 10,
            'total' => count($newsData),
            'from' => 1,
            'to' => count($newsData),
            'links' => [
                [
                    'url' => null,
                    'label' => '&laquo; Previous',
                    'active' => false,
                ],
                [
                    'url' => '/profil',
                    'label' => '1',
                    'active' => true,
                ],
                [
                    'url' => null,
                    'label' => 'Next &raquo;',
                    'active' => false,
                ],
            ],
        ];

        return Inertia::render('profil/Index', [
            'news' => $news,
        ]);
    }
}
