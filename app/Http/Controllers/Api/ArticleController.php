<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get()->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'category' => $article->category,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'is_featured' => $article->is_featured,
                'reading_time' => $article->reading_time,
                // Pastikan thumbnail mengarah ke URL yang benar
                'thumbnail' => $article->thumbnail ? asset('storage/' . $article->thumbnail) : null,
                'created_at' => $article->created_at,
            ];
        });

        return Inertia::render('admin/cms/Article', [
            'articles' => $articles
        ]);
    }

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

        $validated['slug'] = Str::slug($request->title) . '-' . Str::random(5);

        if ($request->hasFile('thumbnail')) {
            // Store hanya mengembalikan path relative: "articles/namafile.jpg"
            $path = $request->file('thumbnail')->store('articles', 'public');
            $validated['thumbnail'] = $path;
        }

        Article::create($validated);

        return redirect()->back()->with('success', 'Artikel berhasil diterbitkan!');
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|in:Berita Utama,Akademik,Koleksi,Event,Layanan',
            'content'      => 'required',
            'excerpt'      => 'required|string|max:500',
            'thumbnail'    => 'nullable', // Ubah ke nullable dulu untuk pengecekan manual
            'reading_time' => 'nullable|integer',
            'is_featured'  => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Validasi manual jika ada file baru
            $request->validate(['thumbnail' => 'image|mimes:jpg,jpeg,png|max:2048']);

            if ($article->thumbnail) {
                Storage::disk('public')->delete($article->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('articles', 'public');
        } else {
            // Jika tidak upload foto baru, tetap gunakan foto lama
            unset($validated['thumbnail']);
        }

        $article->update($validated);

        return redirect()->back()->with('success', 'Artikel berhasil diperbarui!');
    }

    public function destroy(Article $article)
    {
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();
        return redirect()->back()->with('success', 'Artikel berhasil dihapus!');
    }
}
