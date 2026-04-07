<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'book_id',
        'borrow_date',
        'due_date',
        'return_date',
        'status',
        'notes',
    ];

    // Casting tanggal agar otomatis menjadi object Carbon
    protected $casts = [
        'borrow_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
    ];

    // Relasi ke Member
    public function member()
    {
        return $this->belongsTo(Membership::class);
    }

    // Relasi ke Book
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    // Accessor untuk mengecek keterlambatan secara otomatis
    public function getIsOverdueAttribute()
    {
        if ($this->status === 'dipinjam' && Carbon::now()->gt($this->due_date)) {
            return true;
        }

        return false;
    }
}
