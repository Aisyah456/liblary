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
            ['code' => 'FT', 'name' => 'Fakultas Teknik'],
            ['code' => 'FEB', 'name' => 'Fakultas Ekonomi dan Bisnis'],
            ['code' => 'FH', 'name' => 'Fakultas Hukum'],
            ['code' => 'FK', 'name' => 'Fakultas Kedokteran'],
            ['code' => 'FISIP', 'name' => 'Fakultas Ilmu Sosial dan Politik'],
            ['code' => 'FP', 'name' => 'Fakultas Pertanian'],
        ];

        foreach ($faculties as $faculty) {
            Faculty::updateOrCreate(
                ['code' => $faculty['code']], // kunci unik
                ['name' => $faculty['name']]
            );
        }
    }
}
