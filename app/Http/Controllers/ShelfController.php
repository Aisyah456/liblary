<?php

namespace App\Http\Controllers;

use App\Models\Shelf;
use Illuminate\Http\Request;
// Pastikan menggunakan base controller Laravel
use Inertia\Inertia;

class ShelfController extends Controller
{
    /**
     * Menampilkan daftar rak.
     */
    public function index()
    {
        return Inertia::render('admin/Shelf', [
            // Mengambil semua rak beserta jumlah karya ilmiah yang terkait
            'shelves' => Shelf::withCount('scientificWorks')
                ->latest() // Menampilkan yang terbaru ditambahkan di atas
                ->get(),
        ]);
    }

    /**
     * Menyimpan rak baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:shelves,code',
            'name' => 'required|string|max:100',
            'location' => 'required|string|max:255',
        ]);

        Shelf::create($validated);

        return redirect()->back()->with('success', 'Rak berhasil ditambahkan.');
    }

    /**
     * Memperbarui data rak yang sudah ada.
     */
    public function update(Request $request, Shelf $shelf)
    {
        $validated = $request->validate([
            // Abaikan pengecekan unique untuk ID rak ini sendiri
            'code' => 'required|string|max:50|unique:shelves,code,'.$shelf->id,
            'name' => 'required|string|max:100',
            'location' => 'required|string|max:255',
        ]);

        $shelf->update($validated);

        return redirect()->back()->with('success', 'Data rak berhasil diperbarui.');
    }

    /**
     * Menghapus rak jika tidak ada karya ilmiah di dalamnya.
     */
    public function destroy(Shelf $shelf)
    {
        // Proteksi agar rak yang masih ada isinya tidak bisa dihapus sembarangan
        if ($shelf->scientificWorks()->exists()) {
            return redirect()->back()->withErrors([
                'message' => 'Rak tidak bisa dihapus karena masih terkait dengan data karya ilmiah.',
            ]);
        }

        $shelf->delete();

        return redirect()->back()->with('success', 'Rak berhasil dihapus.');
    }
}
