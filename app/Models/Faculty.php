<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculties';

    public function majors(): HasMany
    {
        return $this->hasMany(Major::class);
    }

    protected $fillable = [
        'code',
        'name',
    ];
}
