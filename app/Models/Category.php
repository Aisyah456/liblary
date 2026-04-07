<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi (Mass Assignment).
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Boot function untuk menghandle pembuatan slug otomatis.
     */
    protected static function boot()
    {
        parent::boot();

        // Otomatis buat slug saat kategori baru dibuat
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function scientificWorks(): HasMany
    {
        return $this->hasMany(ScientificWork::class);
    }
}
