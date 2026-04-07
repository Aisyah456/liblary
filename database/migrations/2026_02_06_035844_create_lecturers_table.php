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
        Schema::create('lecturers', function (Blueprint $table) {
            $table->id();
            $table->string('nidn', 20)->unique(); // Nomor Induk Dosen Nasional
            $table->string('nama_lengkap');
            $table->string('email')->unique();
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('program_studi');
            $table->string('jabatan_fungsional')->nullable(); // Contoh: Lektor, Asisten Ahli
            $table->text('alamat')->nullable();
            $table->string('telepon', 15)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecturers');
    }
};
