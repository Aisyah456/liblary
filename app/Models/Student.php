<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi (mass assignable).
     * Sesuai dengan Blueprint di migrasi Anda.
     */
    protected $fillable = [
        'user_id',
        'nim',
        'program_studi',
        'fakultas',
        'angkatan',
        'no_telp',
        'alamat',
        'max_pinjam',
        'status',
    ];

    /**
     * Relasi ke model User (Setiap mahasiswa adalah seorang user).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function membership()
    {
        return $this->morphOne(Membership::class, 'memberable');
    }
}
