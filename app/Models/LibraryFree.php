<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryFree extends Model
{
    protected $fillable = [
        'full_name',
        'nim',
        'faculty_id',
        'major_id',
        'phone_number',
        'email',
        'degree_level',
        'purpose',
        'entry_year',
        'graduation_year',
        'scientific_paper_path',
        'ktm_scan_path',
        'upload_proof_path',
        'turnitin_similarity_score',
        'status',
        'admin_notes',
    ];

    // Relasi ke Fakultas
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    // Relasi ke Program Studi
    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
