<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'identifier_id',
        'full_name',
        'title',
        'document_type',
        'file_path',
        'academic_year',
        'prodi',
        'status',
    ];

    /**
     * Relasi ke model User.
     * Setiap submission dimiliki oleh satu user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk mempermudah filter berdasarkan status di Controller.
     * Contoh penggunaan: Submission::pending()->get();
     */
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }
}
