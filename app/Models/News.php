<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'category',
        'excerpt',
        'body',
        'published_at',
        'is_published',
        'is_featured',
        'author_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }
}
