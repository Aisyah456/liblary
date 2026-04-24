<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookProposal extends Model
{
   protected $fillable = [
    'full_name',
    'identifier_id',
    'email',
    'phone_number',
    'requester_type',
    'institution',
    'title',
    'author',
    'publisher',
    'isbn',
    'publish_year',
    'reason',
    'reference_link',
    'status',
    'admin_note'
];
}
