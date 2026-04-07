<?php

namespace App\Http\Controllers;

use App\Models\LibraryClearance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LibraryClearanceController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/LibraryClearance', [
            'clearances' => LibraryClearance::with('user:id,name,email')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Menyimpan data pengajuan baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'certificate_number' => 'nullable|string|unique:library_clearances,certificate_number',
            'has_returned_all_books' => 'required|boolean',
            'has_paid_fines' => 'required|boolean',
            'status' => 'required|in:request,verified,rejected',
        ]);

        LibraryClearance::create($validated);

        return Redirect::back()->with('success', 'Data pengajuan berhasil ditambahkan.');
    }

    /**
     * Memperbarui data (verifikasi/sertifikat).
     */
    public function update(Request $request, LibraryClearance $libraryClearance)
    {
        $validated = $request->validate([
            'certificate_number' => 'nullable|string|unique:library_clearances,certificate_number,'.$libraryClearance->id,
            'has_returned_all_books' => 'required|boolean',
            'has_paid_fines' => 'required|boolean',
            'status' => 'required|in:request,verified,rejected',
        ]);

        $libraryClearance->update($validated);

        return Redirect::back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Menghapus record pengajuan.
     */
    public function destroy(LibraryClearance $libraryClearance)
    {
        $libraryClearance->delete();

        return Redirect::back()->with('success', 'Data berhasil dihapus.');
    }
}
