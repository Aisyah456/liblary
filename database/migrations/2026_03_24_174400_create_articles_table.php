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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();

            // Pilihan kategori tetap dalam satu tabel
            $table->enum('category', [
                'Berita Utama',
                'Akademik',
                'Koleksi',
                'Event',
                'Layanan'
            ])->default('Berita Utama');

            $table->text('excerpt');
            $table->longText('content');
            $table->string('thumbnail')->nullable();
            $table->integer('reading_time')->default(5);
            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
