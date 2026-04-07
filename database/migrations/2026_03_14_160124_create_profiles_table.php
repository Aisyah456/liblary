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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Contoh: "Sejarah Perpustakaan"
            $table->string('slug')->unique();
            $table->string('thumbnail')->nullable();
            $table->string('category')->nullable(); // Contoh: "Visi Misi", "Sejarah", "Struktur"
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->foreignId('author_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
