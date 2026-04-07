<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryClearance extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'certificate_number',
        'has_returned_all_books',
        'has_paid_fines',
        'status',
    ];

    /**
     * Casting atribut ke tipe data yang sesuai.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'has_returned_all_books' => 'boolean',
        'has_paid_fines' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke model User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk mempermudah filter berdasarkan status.
     */
    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }
}
