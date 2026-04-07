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
        Schema::create('hero_sections', function (Blueprint $table) {
            $table->id();
            $table->string('badge_text')->default('Perpustakaan Unggul Terakreditasi A');
            $table->string('title_line_1')->default('Eksplorasi Dunia');
            $table->string('title_highlight')->default('Tanpa Batas.');
            $table->text('subtitle');
            $table->string('image_path')->default('images/Perpustakaan Kampus.jpg');
            $table->string('stats_label')->default('Koleksi');
            $table->string('stats_value')->default('50k+');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_sections');
    }
};
