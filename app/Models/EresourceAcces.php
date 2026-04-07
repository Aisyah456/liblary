<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EresourceAcces extends Model
{
    use HasFactory;

    protected $table = 'eresource_access';

    protected $fillable = [
        'user_id',
        'resource_name',
        'username_given',
        'password_given',
        'expiry_date',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
