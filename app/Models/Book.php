<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = [
        'title',
        'isbn',
        'author',
        'publisher',
        'publication_year',
        'genre',
        'category',
        'description',
        'total_stock',
        'available_stock',
    ];

    /**
     * Casting atribut ke tipe data tertentu.
     * Memastikan stok selalu dibaca sebagai integer.
     */
    protected $casts = [
        'publication_year' => 'integer',
        'total_stock' => 'integer',
        'available_stock' => 'integer',
    ];

    /**
     * Scope untuk mempermudah pencarian buku yang masih tersedia.
     * Contoh penggunaan: Book::available()->get();
     */
    public function scopeAvailable($query)
    {
        return $query->where('available_stock', '>', 0);
    }
}
