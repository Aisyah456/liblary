<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ebook extends Model
{
    protected $fillable = ['category_id', 'title', 'author', 'file_path', 'format'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
