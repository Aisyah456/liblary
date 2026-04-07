<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{

    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/cms/Article', [
            'articles' => $articles
        ]);
    }

    /**
     * Menyimpan artikel baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|in:Berita Utama,Akademik,Koleksi,Event,Layanan',
            'content'      => 'required',
            'excerpt'      => 'required|string|max:500',
            'thumbnail'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'reading_time' => 'nullable|integer',
            'is_featured'  => 'boolean',
        ]);

        // Slug otomatis
        $validated['slug'] = Str::slug($request->title) . '-' . Str::random(5);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('articles', 'public');
        }

        Article::create($validated);

        return redirect()->back()->with('success', 'Artikel berhasil diterbitkan!');
    }

    /**
     * Update artikel (Tambahkan ini jika Anda punya EditArticleModal)
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|in:Berita Utama,Akademik,Koleksi,Event,Layanan',
            'content'      => 'required',
            'excerpt'      => 'required|string|max:500',
            'thumbnail'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'reading_time' => 'nullable|integer',
            'is_featured'  => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Hapus foto lama jika ada
            if ($article->thumbnail) {
                Storage::disk('public')->delete($article->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('articles', 'public');
        }

        $article->update($validated);

        return redirect()->back()->with('success', 'Artikel berhasil diperbarui!');
    }

    /**
     * Menghapus artikel
     */
    public function destroy(Article $article)
    {
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();
        return redirect()->back()->with('success', 'Artikel berhasil dihapus!');
    }
}
