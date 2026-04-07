<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shelf extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'location',
    ];

    public function scientificWorks(): HasMany
    {
        return $this->hasMany(ScientificWork::class);
    }
}
