<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua faculty yang sudah dibuat oleh FacultySeeder
        $faculties = DB::table('faculties')->pluck('id', 'code');

        // =========================
        // Fakultas Teknik (FT)
        // =========================
        if (isset($faculties['FT'])) {
            $facultyId = $faculties['FT'];

            DB::table('majors')->updateOrInsert(
                ['code' => 'TIF'],
                [
                    'faculty_id' => $facultyId,
                    'name' => 'Teknik Informatika',
                    'lecture' => 'Ir. Budi Raharjo, M.T.',
                    'degree_level' => 'S1',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            DB::table('majors')->updateOrInsert(
                ['code' => 'SI'],
                [
                    'faculty_id' => $facultyId,
                    'name' => 'Sistem Informasi',
                    'lecture' => 'Dr. Siti Aminah, M.Kom.',
                    'degree_level' => 'S1',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        // =========================
        // Fakultas Ekonomi (FEB)
        // =========================
        if (isset($faculties['FEB'])) {
            $facultyId = $faculties['FEB'];

            DB::table('majors')->updateOrInsert(
                ['code' => 'AKT'],
                [
                    'faculty_id' => $facultyId,
                    'name' => 'Akuntansi',
                    'lecture' => 'Drs. Heru Prasetyo, M.Ak.',
                    'degree_level' => 'S1',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            DB::table('majors')->updateOrInsert(
                ['code' => 'MB'],
                [
                    'faculty_id' => $facultyId,
                    'name' => 'Manajemen Bisnis',
                    'lecture' => 'Rina Wijaya, S.E., M.M.',
                    'degree_level' => 'D3',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
