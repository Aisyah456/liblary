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
        Schema::create('turnitin_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('processed_by')->constrained('users'); // Tracking siapa yang memproses (Pustakawan)
            $table->decimal('similarity_percentage', 5, 2); // Contoh: 15.50
            $table->date('check_date');
            $table->text('librarian_notes')->nullable();
            $table->string('evidence_path'); // PDF / Screenshot bukti hasil
            $table->enum('verdict', ['Lulus', 'Revisi', 'Ditolak']); // Untuk statistik
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turnitin_results');
    }
};
