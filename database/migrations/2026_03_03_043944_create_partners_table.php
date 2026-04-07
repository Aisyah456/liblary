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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama Perusahaan/Instansi
            $table->string('logo')->nullable(); // Path file logo

            // Kategori: 'supplier' (Partner buku), 'mitra' (Kerjasama instansi)
            $table->enum('type', ['supplier', 'mitra', 'donator'])->default('mitra');

            $table->string('email')->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();

            // Kolom khusus Mitra/Kerjasama
            $table->string('contact_person')->nullable();
            $table->string('mou_number')->nullable();
            $table->date('partnership_expiry')->nullable();

            // Status Aktif
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
