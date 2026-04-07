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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('division_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('title'); // Jabatan
            $table->string('image')->nullable();
            $table->boolean('is_head')->default(false); // Penanda apakah dia Kepala Perpustakaan
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
