<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'logo',
        'type',
        'email',
        'phone',
        'address',
        'contact_person',
        'mou_number',
        'partnership_expiry',
        'is_active',
    ];

    protected $casts = [
        'partnership_expiry' => 'date',
        'is_active' => 'boolean',
    ];

    // --- Helper Image ---
    public function getLogoUrlAttribute(): string
    {
        return $this->logo
            ? asset('storage/'.$this->logo)
            : asset('images/default-logo.png');
    }

    // --- Scopes untuk memfilter data ---
    public function scopeOnlyMitra(Builder $query): void
    {
        $query->where('type', 'mitra');
    }

    public function scopeOnlySupplier(Builder $query): void
    {
        $query->where('type', 'supplier');
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
