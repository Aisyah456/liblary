<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroSection;

class HeroSectionSeeder extends Seeder
{
    public function run(): void
    {
        HeroSection::create([
            'badge_text'      => 'Perpustakaan Unggul Terakreditasi A',
            'title_line_1'    => 'Eksplorasi Dunia',
            'title_highlight' => 'Tanpa Batas.',
            'subtitle'        => 'Pusat literasi digital dan fisik yang mendukung riset masa depan. Akses koleksi jurnal dan buku langka dalam satu genggaman.',
            'image_path'      => 'images/Perpustakaan Kampus.jpg', // Pastikan file ini ada di folder public/images
            'stats_label'     => 'Koleksi',
            'stats_value'     => '50k+',
            'is_active'       => true,
        ]);
    }
}