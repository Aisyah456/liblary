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
        Schema::create('turnitin_submissions', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel prodi
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();

            // Identitas Pengaju (String bebas untuk NIM/NIDN/NIK)
            $table->string('identifier_id', 50);
            $table->string('full_name');
            $table->string('email');

            // Detail Dokumen
            $table->string('title');
            $table->string('document_type'); // Skripsi, Tesis, KTI, Artikel
            $table->string('file_path');     // Path file asli yang diunggah user
            $table->string('academic_year', 20); // Contoh: 2025/2026

            // Workflow Status
            $table->enum('status', ['pending', 'processing', 'completed', 'rejected'])->default('pending');

            // Response dari Admin
            $table->integer('similarity_percentage')->nullable(); // Angka persentase (0-100)
            $table->string('result_file_path')->nullable();      // Path file PDF hasil cek Turnitin
            $table->text('admin_notes')->nullable();             // Alasan jika ditolak atau catatan tambahan

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turnitin_submissions');
    }
};
