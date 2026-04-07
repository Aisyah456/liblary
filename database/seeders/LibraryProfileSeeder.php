<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LibraryProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\LibraryProfile::create([
            'about_title' => 'Tentang Kami',
            'about_description' => 'Perpustakaan Universitas Mohammad Husni Thamrin (UMHT) didirikan sebagai pusat sumber belajar utama bagi sivitas akademika. Kami berkomitmen untuk menyediakan akses informasi yang komprehensif, mulai dari literatur medis hingga teknologi informasi. Hingga saat ini, kami terus bertransformasi menjadi perpustakaan digital yang modern.',
            'vision' => 'Menjadi pusat literasi berbasis teknologi informasi yang unggul dan menjadi rujukan utama riset ilmiah di tingkat nasional pada tahun 2030.',
            'mission' => [
                'Menyediakan koleksi literatur yang mutakhir.',
                'Mengembangkan layanan berbasis digital.',
                'Meningkatkan minat baca dan budaya riset.'
            ],
            'total_books' => 15000,
            'total_staff' => 8,
            'service_hours_weekday' => '08:00 - 17:00',
            'service_hours_weekend' => 'Tutup'
        ]);
    }
}
