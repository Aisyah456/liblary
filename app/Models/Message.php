<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'nama_lengkap',
        'nim_nidn',
        'email',
        'subjek',
        'pesan',
        'balasan_admin',
        'status',
        'tgl_dibalas'
    ];

    protected $casts = [
            'tgl_dibalas' => 'datetime',
        ];
}
