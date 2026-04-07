<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EresourceAccess extends Model
{
    protected $table = 'eresource_access';

    protected $fillable = [
        'user_id',
        'resource_name',
        'username_given',
        'password_given',
        'expiry_date',
    ];
}
