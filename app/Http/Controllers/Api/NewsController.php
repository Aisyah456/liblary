<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;

class NewsController extends Controller
{
    public function index()
    {
        return News::where('is_published', true)
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();
    }
}
