<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            // Fakultas Ekonomi dan Bisnis
            ['f_name' => 'Fakultas Ekonomi dan Bisnis', 'code' => '61114', 'name' => 'Magister Manajemen', 'lecture' => 'SUSIANA DEWI RATIH', 'level' => 'S2'],
            ['f_name' => 'Fakultas Ekonomi dan Bisnis', 'code' => '61201', 'name' => 'Manajemen', 'lecture' => 'EPENDI', 'level' => 'S1'],
            ['f_name' => 'Fakultas Ekonomi dan Bisnis', 'code' => '62201', 'name' => 'Akuntansi', 'lecture' => 'LILY NABILAH', 'level' => 'S1'],

            // Fakultas Kesehatan
            ['f_name' => 'Fakultas Kesehatan', 'code' => '13101', 'name' => 'Magister Kesehatan Masyarakat', 'lecture' => 'NUR ASNIATI DJAALI', 'level' => 'S2'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '13201', 'name' => 'Kesehatan Masyarakat', 'lecture' => 'AJENG SETIANINGSIH', 'level' => 'S1'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '13211', 'name' => 'Gizi', 'lecture' => 'PARLIN DWIJANA', 'level' => 'S1'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '13350', 'name' => 'Teknologi Laboratorium Medis', 'lecture' => 'SUMIATI BEDAH', 'level' => 'D4'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '14201', 'name' => 'Keperawatan', 'lecture' => 'LIA FITRI YANTI', 'level' => 'S1'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '14901', 'name' => 'Profesi Ners', 'lecture' => 'LIA FITRI YANTI', 'level' => 'Prof'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '15201', 'name' => 'Kebidanan', 'lecture' => 'NUR ALAM', 'level' => 'S1'],
            ['f_name' => 'Fakultas Kesehatan', 'code' => '20301', 'name' => 'Teknik Elektromedik', 'lecture' => 'GUNAWAN', 'level' => 'D4'],

            // Fakultas Keguruan dan Ilmu Pendidikan
            ['f_name' => 'Fakultas Keguruan dan Ilmu Pendidikan', 'code' => '86202', 'name' => 'Pendidikan Anak Usia Dini', 'lecture' => 'SOPIAH', 'level' => 'S1'],
            ['f_name' => 'Fakultas Keguruan dan Ilmu Pendidikan', 'code' => '86206', 'name' => 'Pendidikan Guru Sekolah Dasar', 'lecture' => 'AKHMAD SUBKHI RAMDANI', 'level' => 'S1'],
            ['f_name' => 'Fakultas Keguruan dan Ilmu Pendidikan', 'code' => '88203', 'name' => 'Pendidikan Bahasa Inggris', 'lecture' => 'AKHMAD SUBKHI RAMDANI', 'level' => 'S1'],

            // Fakultas Komputer
            ['f_name' => 'Fakultas Komputer', 'code' => '55201', 'name' => 'Teknik Informatika', 'lecture' => 'MUHAMMAD RIDWAN EFFENDI, S.Kom, MMSI', 'level' => 'S1'],
            ['f_name' => 'Fakultas Komputer', 'code' => '57201', 'name' => 'Sistem Informasi', 'lecture' => 'ABU SOPIAN', 'level' => 'S1'],

            // D3
            ['f_name' => 'Universitas Mohammad Husni Thamrin Jakarta', 'code' => '14401', 'name' => 'Keperawatan', 'lecture' => '-', 'level' => 'D3'],
            ['f_name' => 'Universitas Mohammad Husni Thamrin Jakarta', 'code' => '13450', 'name' => 'Teknologi Laboratorium Medis', 'lecture' => 'LENGGO GENI', 'level' => 'D3'],
        ];

        foreach ($majors as $major) {
            $faculty = Faculty::where('name', $major['f_name'])->first();

            if ($faculty) {
                Major::updateOrCreate(
                    ['code' => $major['code']],
                    [
                        'faculty_id'   => $faculty->id,
                        'name'         => $major['name'],
                        'lecture'      => $major['lecture'],
                        'degree_level' => $major['level'],
                    ]
                );
            }
        }
    }
}
