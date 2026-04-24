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
        Schema::create('book_proposals', function (Blueprint $table) {
            $table->id();

            // Data Pengusul (Tanpa User ID)
            $table->string('full_name');
            $table->string('identifier_id')->nullable()->comment('NIM/NIDN/NIK/No.KTP');
            $table->string('email');
            $table->string('phone_number', 20)->nullable();
            $table->enum('requester_type', ['mahasiswa', 'dosen', 'staf', 'umum', 'tamu'])
                ->default('mahasiswa');
            $table->string('institution')->nullable()->comment('Asal Instansi/Fakultas');

            // Detail Buku yang Diusulkan
            $table->string('title');
            $table->string('author')->nullable();
            $table->string('publisher')->nullable();
            $table->string('isbn', 20)->nullable();
            $table->year('publish_year')->nullable();

            // Justifikasi & Referensi
            $table->text('reason')->comment('Alasan pengusulan buku');
            $table->string('reference_link')->nullable()->comment('Link marketplace atau referensi buku');

            // Tracking & Status
            $table->enum('status', ['pending', 'reviewed', 'approved', 'rejected', 'ordered', 'available'])
                ->default('pending');
            $table->text('admin_note')->nullable()->comment('Catatan dari pustakawan');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_proposals');
    }
};
