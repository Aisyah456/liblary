<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    public function index()
    {
        return Inertia::render('Borrowings', [
            'borrowings' => Borrowing::with(['book', 'member.memberable'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'book_id' => 'required|exists:books,id',
            'borrow_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:borrow_date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $book = Book::findOrFail($validated['book_id']);

            // 1. Cek ketersediaan stok
            if ($book->stock <= 0) {
                return back()->withErrors(['book_id' => 'Stok buku sedang kosong.']);
            }

            // 2. Kurangi stok buku
            $book->decrement('stock');

            // 3. Simpan data peminjaman
            Borrowing::create($validated);

            return back()->with('success', 'Peminjaman berhasil dicatat.');
        });
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        $validated = $request->validate([
            'status' => 'required|in:dipinjam,kembali,terlambat',
            'due_date' => 'required|date',
            'return_date' => 'nullable|required_if:status,kembali|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $borrowing) {
            // Logika Stok: Jika status berubah dari 'dipinjam/terlambat' menjadi 'kembali'
            if ($validated['status'] === 'kembali' && $borrowing->status !== 'kembali') {
                $borrowing->book->increment('stock');
            }
            // Sebaliknya, jika admin salah input dan ingin mengembalikan status ke dipinjam
            elseif ($validated['status'] !== 'kembali' && $borrowing->status === 'kembali') {
                $borrowing->book->decrement('stock');
            }

            $borrowing->update($validated);

            return back()->with('success', 'Data peminjaman diperbarui.');
        });
    }

    public function destroy(Borrowing $borrowing)
    {
        // Jika data dihapus saat status masih 'dipinjam', kembalikan stoknya
        if ($borrowing->status !== 'kembali') {
            $borrowing->book->increment('stock');
        }

        $borrowing->delete();

        return back()->with('success', 'Data peminjaman dihapus.');
    }
}
