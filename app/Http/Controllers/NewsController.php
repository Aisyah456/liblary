<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Daftar berita (hanya yang published).
     */
    public function index(Request $request)
    {
        $news = News::query()
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('news/Index', [
            'news' => $news,
        ]);
    }

    /**
     * Detail berita by slug.
     */
    public function show(string $slug)
    {
        $news = News::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with('author:id,name')
            ->firstOrFail();

        return Inertia::render('news/Show', [
            'news' => $news,
        ]);
    }
}
