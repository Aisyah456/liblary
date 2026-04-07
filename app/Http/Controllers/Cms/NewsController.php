<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        $news = News::query()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/cms/News', [
            'news' => $news,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request);

            // Handle Upload Gambar
            if ($request->hasFile('thumbnail')) {
                $validated['thumbnail'] = $request->file('thumbnail')->store('news', 'public');
            }

            $validated['slug'] = $this->resolveSlug($request->title, null);

            News::create($validated);

            return back()->with('success', 'Berita berhasil ditambahkan.');
        } catch (\Throwable $e) {
            Log::error('Store News Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Gagal menambah berita: '.$e->getMessage()]);
        }
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request, $news->id);

            // Perbaikan Logika: Hapus thumbnail dari array $validated jika bukan File
            // Ini mencegah error "The thumbnail must be an image" jika hanya string path lama yang dikirim
            if (!$request->hasFile('thumbnail')) {
                unset($validated['thumbnail']);
            } else {
                if ($news->thumbnail) {
                    Storage::disk('public')->delete($news->thumbnail);
                }
                $validated['thumbnail'] = $request->file('thumbnail')->store('news', 'public');
            }

            $validated['slug'] = $this->resolveSlug($request->title, $news);

            $news->update($validated);

            return back()->with('success', 'Berita berhasil diperbarui.');
        } catch (\Throwable $e) {
            Log::error('Update News Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal memperbarui berita.']);
        }
    }

    private function validateRequest(Request $request, $id = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'excerpt' => ['nullable', 'string'],
            'body' => ['required', 'string'],
            // Validasi thumbnail lebih fleksibel
            'thumbnail' => $request->hasFile('thumbnail')
                ? ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']
                : ['nullable'],
            'published_at' => ['nullable', 'date'],
            // Tambahkan "sometimes" untuk boolean agar tidak error jika tidak terkirim via FormData
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);
    }

    public function destroy(News $news): RedirectResponse
    {
        try {
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }
            $news->delete();

            return back()->with('success', 'Berita berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal menghapus berita.']);
        }
    }

    private function resolveSlug(string $title, ?News $existing): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $n = 0;

        while (News::where('slug', $slug)->where('id', '!=', $existing?->id ?? 0)->exists()) {
            $slug = $base.'-'.(++$n);
        }

        return $slug;
    }
}
