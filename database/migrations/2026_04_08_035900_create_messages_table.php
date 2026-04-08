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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // Kolom dari input formulir (Flat / Tanpa Relasi)
            $table->string('nama_lengkap');
            $table->string('nim_nidn')->nullable(); // Opsional sesuai placeholder
            $table->string('email');
            $table->string('subjek'); // Informasi Peminjaman, dll.
            $table->text('pesan');

            // Kolom untuk sistem CRUD & Balasan
            $table->text('balasan_admin')->nullable(); // Tempat menyimpan teks balasan
            $table->enum('status', ['pending', 'selesai'])->default('pending');
            $table->timestamp('tgl_dibalas')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
