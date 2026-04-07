<?php

namespace App\Http\Controllers;

use App\Models\BookSuggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookReferenceController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/layanan/References', [
            'suggestions' => BookSuggestion::with('user:id,name')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:20',
            'publication_year' => 'nullable|integer|digits:4',
            'reason' => 'nullable|string',
        ]);

        // Otomatis mengambil user_id dari user yang sedang login
        BookSuggestion::create($validated + [
            'user_id' => Auth::id(),
            'status' => 'pending',
        ]);

        return redirect()->back()->with('message', 'Usulan buku berhasil dikirim.');
    }

    /**
     * Memperbarui usulan (Biasanya digunakan Admin untuk Approve/Reject)
     */
    public function update(Request $request, BookSuggestion $suggestion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:20',
            'publication_year' => 'nullable|integer|digits:4',
            'reason' => 'nullable|string',
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $suggestion->update($validated);

        return redirect()->back()->with('message', 'Status usulan berhasil diperbarui.');
    }

    /**
     * Menghapus usulan buku
     */
    public function destroy(BookSuggestion $suggestion)
    {
        $suggestion->delete();

        return redirect()->back()->with('message', 'Usulan buku berhasil dihapus.');
    }
}
