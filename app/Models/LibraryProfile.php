<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LibraryProfile extends Model
{
    protected $fillable = [
        'about_title',
        'about_description',
        'vision',
        'mission',
        'total_books',
        'total_staff',
        'service_hours_weekday',
        'service_hours_weekend',
    ];

    // Menangani konversi otomatis Array <-> JSON
    protected $casts = [
        'mission' => 'array',
        'total_books' => 'integer',
        'total_staff' => 'integer',
    ];
}
