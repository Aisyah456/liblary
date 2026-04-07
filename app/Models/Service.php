<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'icon',
        'title',
        'subtitle',
        'description',
        'features',
        'link',
        'order',
        'is_active',
    ];

    // PENTING: Cast field features ke array
    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
