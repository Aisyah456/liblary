<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Controller;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Book', [
            'books' => Book::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:20|unique:books,isbn',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1900|max:'.(date('Y') + 1),
            'genre' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'total_stock' => 'required|integer|min:0',
        ]);

        // Secara default, saat buku baru ditambah, stok tersedia sama dengan total stok
        $validated['available_stock'] = $request->total_stock;

        Book::create($validated);

        return Redirect::back()->with('success', 'Buku berhasil ditambahkan ke katalog.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:20|unique:books,isbn,'.$book->id,
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1900|max:'.(date('Y') + 1),
            'genre' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'total_stock' => 'required|integer|min:0',
        ]);

        // Logika penyesuaian available_stock jika total_stock berubah
        $selisihStok = $request->total_stock - $book->total_stock;
        $validated['available_stock'] = $book->available_stock + $selisihStok;

        // Pastikan available_stock tidak negatif
        if ($validated['available_stock'] < 0) {
            $validated['available_stock'] = 0;
        }

        $book->update($validated);

        return Redirect::back()->with('success', 'Informasi buku berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // Opsional: Cek apakah buku sedang dipinjam sebelum dihapus
        if ($book->available_stock < $book->total_stock) {
            return Redirect::back()->with('error', 'Buku tidak bisa dihapus karena masih ada yang meminjam.');
        }

        $book->delete();

        return Redirect::back()->with('success', 'Buku berhasil dihapus dari katalog.');
    }
}
