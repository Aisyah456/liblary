<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    //

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
