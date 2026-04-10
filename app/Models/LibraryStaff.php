<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryStaff extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan oleh model ini.
     * Karena nama tabel kita 'library_staff' (snake_case), 
     * Laravel sebenarnya sudah mendeteksi ini secara otomatis, 
     * tapi mendefinisikannya secara eksplisit adalah praktik yang baik.
     */
    protected $table = 'library_staff';

    /**
     * Kolom yang dapat diisi secara massal.
     * Sangat penting untuk keamanan agar tidak sembarang kolom bisa diinput.
     */
    protected $fillable = [
        'name',
        'title',
        'division',
        'image',
        'is_head',
        'order',
    ];

    /**
     * Casting tipe data.
     * Memastikan 'is_head' selalu dibaca sebagai boolean, bukan integer 0/1.
     * Memastikan 'order' selalu dibaca sebagai integer.
     */
    protected $casts = [
        'is_head' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Scope untuk mengambil hanya Kepala Perpustakaan.
     * Penggunaan di Controller: LibraryStaff::head()->first();
     */
    public function scopeHead($query)
    {
        return $query->where('is_head', true);
    }

    /**
     * Scope untuk mengambil staf biasa (bukan kepala).
     * Penggunaan di Controller: LibraryStaff::stafOnly()->get();
     */
    public function scopeStafOnly($query)
    {
        return $query->where('is_head', false)->orderBy('order');
    }
}
