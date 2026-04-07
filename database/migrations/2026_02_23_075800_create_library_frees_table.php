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
        Schema::create('library_frees', function (Blueprint $table) {
            $table->id();
            // Informasi Mahasiswa
            $table->string('full_name');
            $table->string('nim')->unique();
            $table->string('phone_number');
            $table->string('email');

            // Relasi Akademik
            $table->foreignId('faculty_id')->constrained()->cascadeOnDelete();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->string('degree_level'); // Jenjang Pendidikan

            // Data Kelulusan
            $table->string('purpose'); // Keperluan
            $table->year('entry_year');
            $table->year('graduation_year');

            // File Uploads (Path Storage)
            $table->string('scientific_paper_path'); // File Karya Ilmiah (.pdf)
            $table->string('ktm_scan_path');         // Scan KTM
            $table->string('upload_proof_path')->nullable(); // Bukti Upload (Opsional)

            // Modul Turnitin & Status Admin
            $table->decimal('turnitin_similarity_score', 5, 2)->nullable(); // Hasil %
            $table->string('turnitin_report_url')->nullable(); // Link ke hasil PDF Turnitin
            $table->enum('status', ['pending', 'verifying', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable(); // Catatan jika ditolak (misal: "File PDF korup")
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_frees');
    }
};
