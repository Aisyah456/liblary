<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi secara massal.
     */
    protected $fillable = [
        'user_id',
        'book_id',
        'loan_date',
        'due_date',
        'return_date',
        'fine_amount',
        'status',
    ];

    /**
     * Casting tipe data kolom.
     */
    protected $casts = [
        'loan_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
        'fine_amount' => 'integer',
    ];

    /**
     * Relasi ke User (Peminjam).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Book (Buku yang dipinjam).
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Scope untuk memfilter pinjaman yang terlambat.
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'active')
            ->where('due_date', '<', now());
    }

    /**
     * Method pembantu untuk menghitung denda secara dinamis.
     * Misal: denda Rp 1.000 per hari.
     */
    public function calculateFine()
    {
        if ($this->status !== 'returned' && now() > $this->due_date) {
            $daysLate = now()->diffInDays($this->due_date);
            $finePerDay = 1000;

            return $daysLate * $finePerDay;
        }

        return 0;
    }
}
