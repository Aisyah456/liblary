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
        Schema::create('library_staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('division')->nullable(); // Null untuk Kepala Perpustakaan
            $table->string('image')->nullable();
            $table->boolean('is_head')->default(false); // Penanda Kepala Perpustakaan
            $table->integer('order')->default(0); // Untuk mengurutkan staf dalam divisi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_staff');
    }
};
