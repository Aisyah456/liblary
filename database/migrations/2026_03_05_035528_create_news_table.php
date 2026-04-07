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
        Schema::create('news', function (Blueprint $table) {
            $table->id();

            // Informasi dasar berita
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('thumbnail')->nullable(); // path gambar cover
            $table->string('category')->nullable();

            // Konten
            $table->text('excerpt')->nullable(); // ringkasan pendek
            $table->longText('body'); // isi lengkap berita

            // Metadata & status
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);

            // Relasi opsional ke user sebagai penulis
            $table->foreignId('author_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
