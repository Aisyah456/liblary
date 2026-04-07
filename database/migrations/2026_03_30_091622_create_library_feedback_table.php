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
        Schema::create('library_feedback', function (Blueprint $table) {
            $table->id();
            // Menyimpan kategori (Koleksi Buku, Layanan Digital, dll)
            $table->string('category');
            // Menyimpan angka 1-5
            $table->unsignedTinyInteger('rating')->default(5);
            // Menyimpan isi aduan/pesan
            $table->text('message');
            // Menyimpan tipe masukan (Saran/Aduan)
            $table->string('type')->default('Saran/Aduan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_feedback');
    }
};
