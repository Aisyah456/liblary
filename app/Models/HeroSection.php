<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'badge_text',
        'title_line_1',
        'title_highlight',
        'subtitle',
        'image_path',
        'stats_label',
        'stats_value',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
