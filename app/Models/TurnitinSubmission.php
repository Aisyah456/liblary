<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class TurnitinSubmission extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi secara massal.
     */
    protected $fillable = [
        'major_id',
        'identifier_id',
        'full_name',
        'email',
        'title',
        'document_type',
        'file_path',
        'academic_year',
        'status',
        'similarity_percentage',
        'result_file_path',
        'admin_notes',
    ];

    /**
     * Properti tambahan yang akan disertakan dalam format JSON/Array.
     * Ini penting agar Inertia bisa membaca file_url dan result_file_url.
     */
    protected $appends = [
        'file_url',
        'result_file_url',
    ];

    /**
     * Casting tipe data kolom.
     */
    protected $casts = [
        'similarity_percentage' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke Model Major.
     * Sesuai migration: major_id -> majors table.
     */
    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    /**
     * Accessor Modern untuk mendapatkan URL file asli.
     * Penggunaan di frontend: submission.file_url
     */
    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->file_path ? Storage::url($this->file_path) : null,
        );
    }

    /**
     * Accessor Modern untuk mendapatkan URL file hasil cek Turnitin.
     * Penggunaan di frontend: submission.result_file_url
     */
    protected function resultFileUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->result_file_path ? Storage::url($this->result_file_path) : null,
        );
    }

    /**
     * Scope untuk mempermudah filter berdasarkan status.
     * Contoh penggunaan: TurnitinSubmission::status('pending')->get();
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
