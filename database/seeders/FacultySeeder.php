<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faculties = [
            ['code' => 'FEB', 'name' => 'Fakultas Ekonomi dan Bisnis'],
            ['code' => 'FKES', 'name' => 'Fakultas Kesehatan'],
            ['code' => 'FKIP', 'name' => 'Fakultas Keguruan dan Ilmu Pendidikan'],
            ['code' => 'FKOM', 'name' => 'Fakultas Komputer'],
            ['code' => 'UMHT', 'name' => 'Universitas Mohammad Husni Thamrin Jakarta'],
        ];

        foreach ($faculties as $faculty) {
            Faculty::updateOrCreate(
                ['code' => $faculty['code']], // kunci unik
                ['name' => $faculty['name']]
            );
        }
    }
}
