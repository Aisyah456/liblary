<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/Loan', [
            'loans' => Loan::with(['user:id,name', 'book:id,title'])
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Menyimpan data peminjaman baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'loan_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:loan_date',
            'status' => 'required|in:active,returned,overdue',
        ]);

        Loan::create($validated);

        return Redirect::back()->with('success', 'Peminjaman berhasil dicatat.');
    }

    /**
     * Update data peminjaman (biasanya untuk pengembalian atau update denda).
     */
    public function update(Request $request, Loan $loan)
    {
        $validated = $request->validate([
            'return_date' => 'nullable|date',
            'fine_amount' => 'required|integer|min:0',
            'status' => 'required|in:active,returned,overdue',
        ]);

        $loan->update($validated);

        return Redirect::back()->with('success', 'Data peminjaman berhasil diperbarui.');
    }

    /**
     * Menghapus riwayat peminjaman.
     */
    public function destroy(Loan $loan)
    {
        $loan->delete();

        return Redirect::back()->with('success', 'Data peminjaman berhasil dihapus.');
    }
}
