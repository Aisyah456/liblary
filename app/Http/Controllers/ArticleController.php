<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cms/Article', [
            'articles' => Article::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required',
            'excerpt' => 'required|string',
            'content' => 'required',
            'thumbnail' => 'nullable|image|max:2048',
            'reading_time' => 'integer',
            'is_featured' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($request->title);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('articles', 'public');
        }

        Article::create($validated);

        return back()->with('success', 'Artikel berhasil ditambahkan');
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required',
            'excerpt' => 'required|string',
            'content' => 'required',
            'thumbnail' => 'nullable|image|max:2048',
            'reading_time' => 'integer',
            'is_featured' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($request->title);

        if ($request->hasFile('thumbnail')) {
            if ($article->thumbnail) {
                Storage::disk('public')->delete($article->thumbnail);
            }

            $validated['thumbnail'] = $request->file('thumbnail')->store('articles', 'public');
        }

        $article->update($validated);

        return back()->with('success', 'Artikel berhasil diupdate');
    }

    public function destroy(Article $article)
    {
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();

        return back()->with('success', 'Artikel berhasil dihapus');
    }
}
