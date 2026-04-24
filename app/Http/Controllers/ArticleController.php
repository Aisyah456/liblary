<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    /**
     * Menampilkan daftar artikel untuk Admin CMS
     */
    public function index()
    {
        return Inertia::render('Home', [
            'articles' => Article::latest()->get(),
        ]);
    }


    public function show(Article $article)
    {
        return Inertia::render('ShowArticle', [
            'article' => $article
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => ['required', Rule::in(['Berita Utama', 'Akademik', 'Koleksi', 'Event', 'Layanan'])],
            'excerpt' => 'required|string',
            'content' => 'required|string', // Pastikan sesuai field database
            'thumbnail' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'is_featured' => 'boolean',
        ]);

        // Otomatis buat slug yang unik
        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $count = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }
        $validated['slug'] = $slug;

        // Jika artikel ini di-set sebagai Featured, matikan featured artikel lain
        if ($request->is_featured) {
            Article::where('is_featured', true)->update(['is_featured' => false]);
        }

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
            'category' => ['required', Rule::in(['Berita Utama', 'Akademik', 'Koleksi', 'Event', 'Layanan'])],
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'is_featured' => 'boolean',
        ]);

        // Update slug hanya jika judul berubah
        if ($request->title !== $article->title) {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $count = 1;
            while (Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        // Logika Featured: Pastikan hanya ada satu
        if ($request->is_featured && !$article->is_featured) {
            Article::where('is_featured', true)->update(['is_featured' => false]);
        }

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
