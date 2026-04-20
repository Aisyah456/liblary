<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TurnitinResult extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'submission_id',
        'processed_by',
        'similarity_percentage',
        'check_date',
        'librarian_notes',
        'evidence_path',
        'verdict',
    ];

    /**
     * Casting tipe data otomatis.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'similarity_percentage' => 'decimal:2',
        'check_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke data Pengajuan (Submission).
     * Setiap hasil Turnitin merujuk ke satu pengajuan.
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Relasi ke User (Pustakawan yang memproses).
     * Kolom processed_by merujuk ke id di tabel users.
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
