<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    // Secara default Laravel akan mencari tabel 'profiles'
    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'category',
        'excerpt',
        'body',
        'published_at',
        'is_featured',
        'author_id'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
    ];
}
