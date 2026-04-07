<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryFeedback extends Model
{
    use HasFactory;

    // WAJIB: Sesuaikan dengan nama tabel di migration Anda
    protected $table = 'library_feedback';

    // WAJIB: Daftarkan kolom yang boleh diisi
    protected $fillable = [
        'category',
        'rating',
        'message',
        'type',
    ];
}
