<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kosongkan tabel terlebih dahulu jika ingin merefresh data slider saja
        // DB::table('partners')->truncate();

        $partners = [
            [
                'name' => 'Perpustakaan Nasional RI',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=PERPUSNAS',
                'type' => 'mitra',
                'is_active' => true,
            ],
            [
                'name' => 'Elsevier ScienceDirect',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=ScienceDirect',
                'type' => 'mitra',
                'is_active' => true,
            ],
            [
                'name' => 'Gramedia Asri Media',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=Gramedia',
                'type' => 'supplier',
                'is_active' => true,
            ],
            [
                'name' => 'ProQuest',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=ProQuest',
                'type' => 'mitra',
                'is_active' => true,
            ],
            [
                'name' => 'Penerbit Erlangga',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=Erlangga',
                'type' => 'supplier',
                'is_active' => true,
            ],
            [
                'name' => 'SpringerLink',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=Springer',
                'type' => 'mitra',
                'is_active' => true,
            ],
            [
                'name' => 'Wiley Online Library',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=Wiley',
                'type' => 'mitra',
                'is_active' => true,
            ],
            [
                'name' => 'Mizan Publika',
                'logo' => 'https://placehold.co/400x200/EEE/31343C?text=Mizan',
                'type' => 'supplier',
                'is_active' => true,
            ],
        ];

        foreach ($partners as $partner) {
            DB::table('partners')->insert(array_merge($partner, [
                'created_at' => now(),
                'updated_at' => now(),
                // Menambahkan data dummy tambahan untuk kelengkapan tabel
                'email' => strtolower(str_replace(' ', '.', $partner['name'])) . '@example.com',
                'contact_person' => 'Admin ' . $partner['name'],
            ]));
        }
    }
}
