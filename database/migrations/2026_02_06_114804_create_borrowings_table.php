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
        Schema::create('borrowings', function (Blueprint $table) {
            $table->id();

            // Menjamin tipe data sama (bigInteger unsigned)
            $table->foreignId('memberships_id')->constrained('memberships')->onDelete('cascade');
            $table->foreignId('books_id')->constrained('books')->onDelete('cascade');

            $table->date('borrow_date')->useCurrent();
            $table->date('due_date');
            $table->date('return_date')->nullable();
            $table->decimal('fine_amount', 10, 2)->default(0);
            $table->enum('status', ['dipinjam', 'kembali', 'terlambat', 'hilang'])->default('dipinjam');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};
