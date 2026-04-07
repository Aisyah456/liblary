<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $prodi = [
            'Informatika' => 'Fakultas Ilmu Komputer',
            'Sistem Informasi' => 'Fakultas Ilmu Komputer',
            'Teknik Elektro' => 'Fakultas Teknik',
            'Manajemen' => 'Fakultas Ekonomi',
            'Akuntansi' => 'Fakultas Ekonomi',
            'Hukum' => 'Fakultas Hukum',
        ];

        for ($i = 1; $i <= 7; $i++) {
            $name = $faker->name;

            // Buat User
            $userId = DB::table('users')->insertGetId([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)).$i.'@example.test',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $namaProdi = $faker->randomElement(array_keys($prodi));
            $namaFakultas = $prodi[$namaProdi];

            // Insert ke tabel students
            DB::table('students')->insert([
                'user_id' => $userId,
                'nim' => '202'.$faker->numberBetween(1, 4).$faker->unique()->numerify('#####'),
                'program_studi' => $namaProdi,
                'fakultas' => $namaFakultas,
                'angkatan' => $faker->numberBetween(2021, 2024),
                // PERBAIKAN DI SINI: Menggunakan numerify agar panjangnya terkontrol (max 13 digit)
                'no_telp' => '08'.$faker->numerify('##########'),
                'alamat' => $faker->address,
                'max_pinjam' => 3,
                'status' => $faker->randomElement(['Aktif', 'Nonaktif', 'Lulus', 'Cuti']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
