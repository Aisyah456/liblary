<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScientificWork extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi melalui mass assignment.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'title',
        'researcher',
        'publication_year',
        'doi',
        'abstract',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
