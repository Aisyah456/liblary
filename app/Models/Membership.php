<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'memberable_id',
        'memberable_type',
        'library_card_number',
        'status',
        'joined_at',
        'expires_at',
    ];

    public function memberable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relasi ke riwayat peminjaman.
     */
    // public function loans(): HasMany
    // {
    //     return $this->hasMany(Loan::class);
    // }
}
