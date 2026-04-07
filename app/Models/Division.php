<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    public function members()
    {
        return $this->hasMany(Staff::class)->orderBy('order');
    }
}
