<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferenceService extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi melalui mass assignment.
     */
    protected $fillable = [
        'user_id',
        'subject_area',
        'description',
        'status',
        'librarian_notes',
    ];

    /**
     * Mendapatkan user (pemohon) yang memiliki layanan referensi ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
