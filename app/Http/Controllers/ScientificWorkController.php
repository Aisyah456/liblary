<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ScientificWork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Controller;
use Inertia\Inertia;

class ScientificWorkController extends Controller
{
    /**
     * Menampilkan daftar karya ilmiah.
     */
    public function index()
    {
        return Inertia::render('admin/Scientific', [
            // Gunakan pagination jika data sudah banyak di masa depan
            'scientificWorks' => ScientificWork::with('category:id,name')
                ->latest()
                ->get(),
            'categories' => Category::orderBy('name', 'asc')->get(['id', 'name']),
        ]);
    }

    /**
     * Menyimpan karya ilmiah baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'researcher' => 'required|string|max:255',
            // Gunakan min/max tahun agar input lebih masuk akal
            'publication_year' => 'required|integer|min:1900|max:'.(date('Y') + 1),
            'doi' => 'nullable|string|max:100',
            'abstract' => 'nullable|string',
        ]);

        ScientificWork::create($validated);

        // Redirect back dengan membawa pesan sukses (Flash Message)
        return Redirect::back()->with('message', 'Karya ilmiah berhasil ditambahkan.');
    }

    /**
     * Memperbarui data karya ilmiah.
     */
    public function update(Request $request, ScientificWork $scientificWork)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'researcher' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1900|max:'.(date('Y') + 1),
            'doi' => 'nullable|string|max:100',
            'abstract' => 'nullable|string',
        ]);

        $scientificWork->update($validated);

        return Redirect::back()->with('message', 'Data berhasil diperbarui.');
    }

    /**
     * Menghapus karya ilmiah.
     */
    public function destroy(ScientificWork $scientificWork)
    {
        $scientificWork->delete();

        return Redirect::back()->with('message', 'Data berhasil dihapus.');
    }
}
