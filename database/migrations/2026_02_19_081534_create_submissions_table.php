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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relasi ke tabel users
            $table->string('identifier_id'); // NIM / NIDN
            $table->string('full_name');
            $table->string('title'); // Judul karya
            $table->enum('document_type', ['Skripsi', 'Tesis', 'Artikel']);
            $table->string('file_path'); // Path dokumen asli
            $table->string('academic_year'); // Untuk arsip/riwayat per tahun akademik
            $table->string('prodi'); // Untuk filter pengolahan data
            $table->enum('status', ['Pending', 'Processing', 'Completed', 'Rejected'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
