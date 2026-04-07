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
        Schema::create('library_profiles', function (Blueprint $table) {
            $table->id();
            // Section: Tentang Kami
            $table->string('about_title')->default('Tentang Kami');
            $table->text('about_description');

            // Section: Visi & Misi
            $table->text('vision');
            $table->json('mission'); // Disimpan sebagai array JSON

            // Section: Informasi Cepat (Stats)
            $table->integer('total_books')->default(0);
            $table->integer('total_staff')->default(0);

            // Section: Jam Layanan
            $table->string('service_hours_weekday')->default('08:00 - 17:00');
            $table->string('service_hours_weekend')->default('Tutup');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_profiles');
    }
};
