<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'slug',
        'category',
        'excerpt',
        'content',
        'thumbnail',
        'reading_time',
        'is_featured',
        'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'reading_time' => 'integer',
        'views' => 'integer',
        'created_at' => 'datetime:Y-m-d',
    ];

    // Konstanta untuk pilihan di Dropdown Form
    public const CATEGORIES = [
        'Berita Utama',
        'Akademik',
        'Koleksi',
        'Event',
        'Layanan'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Scope untuk mempermudah pengambilan data di Controller
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
