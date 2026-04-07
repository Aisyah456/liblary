<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scientific_works', function (Blueprint $table) {
            // Menambahkan kolom shelf_id yang boleh kosong (nullable)
            // dan menghubungkannya ke tabel shelves
            $table->foreignId('shelf_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('scientific_works', function (Blueprint $table) {
            $table->dropForeign(['shelf_id']);
            $table->dropColumn('shelf_id');
        });
    }
};
