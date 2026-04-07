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
        Schema::create('reference_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Pemohon
            $table->string('subject_area'); // Bidang ilmu
            $table->text('description'); // Detail pertanyaan/topik
            $table->enum('status', ['pending', 'processing', 'completed'])->default('pending');
            $table->text('librarian_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_services');
    }
};
