<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'nidn',
        'nama_lengkap',
        'email',
        'jenis_kelamin',
        'program_studi',
        'jabatan_fungsional',
        'alamat',
        'telepon',
    ];

    public function membership()
    {
        return $this->morphOne(Membership::class, 'memberable');
    }
}
