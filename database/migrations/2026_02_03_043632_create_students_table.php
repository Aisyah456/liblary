<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('nim')->unique();
            $table->string('program_studi');
            $table->string('fakultas');
            $table->year('angkatan');
            // Kontak & Keperluan Perpustakaan
            $table->string('no_telp', 15)->nullable();
            $table->text('alamat')->nullable();
            $table->integer('max_pinjam')->default(3); // Membatasi jumlah buku yang boleh dipinjam

            // Status & Log
            $table->enum('status', ['Aktif', 'Nonaktif', 'Lulus', 'Cuti'])->default('Aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
