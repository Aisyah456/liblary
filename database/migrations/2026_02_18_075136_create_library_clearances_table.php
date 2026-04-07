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
        Schema::create('library_clearances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('certificate_number')->unique()->nullable(); // Nomor surat jika sudah terbit
            $table->boolean('has_returned_all_books')->default(false);
            $table->boolean('has_paid_fines')->default(false);
            $table->enum('status', ['request', 'verified', 'rejected'])->default('request');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_clearances');
    }
};
