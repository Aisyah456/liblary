<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LibraryStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // 1. Tambah Kepala Perpustakaan
        DB::table('library_staff')->insert([
            'name' => 'Dr. H. Ahmad Fauzi, M.Hum',
            'title' => 'Kepala Perpustakaan',
            'division' => null,
            'image' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
            'is_head' => true,
            'order' => 1
        ]);

        // 2. Tambah Staff per Divisi
        $data = [
            'Layanan & Sirkulasi' => [
                ['name' => 'Siti Rahma, S.IPI', 'title' => 'Pustakawan Ahli', 'image' => 'Siti'],
                ['name' => 'Budi Setiawan', 'title' => 'Staf Sirkulasi', 'image' => 'Budi'],
            ],
            'Teknologi Informasi' => [
                ['name' => 'Rian Pratama, S.Kom', 'title' => 'IT Librarian', 'image' => 'Rian'],
            ],
            'Administrasi' => [
                ['name' => 'Dewi Lestari, A.Md', 'title' => 'Staf Tata Usaha', 'image' => 'Dewi'],
            ],
        ];

        foreach ($data as $division => $members) {
            foreach ($members as $index => $m) {
                DB::table('library_staff')->insert([
                    'name' => $m['name'],
                    'title' => $m['title'],
                    'division' => $division,
                    'image' => "https://api.dicebear.com/7.x/avataaars/svg?seed={$m['image']}",
                    'is_head' => false,
                    'order' => $index
                ]);
            }
        }
    }
}
