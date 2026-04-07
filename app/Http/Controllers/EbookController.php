<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Ebooks', [
            'ebooks' => Ebook::with('category')->latest()->get(),
            'categories' => Category::select('id', 'name')->get(),
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
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'file' => 'required|mimes:pdf,epub|max:20480', // Max 20MB
        ]);

        $file = $request->file('file');
        $path = $file->store('ebooks', 'public');

        Ebook::create([
            'title' => $request->title,
            'author' => $request->author,
            'category_id' => $request->category_id,
            'file_path' => $path,
            'format' => $file->getClientOriginalExtension(),
        ]);

        return redirect()->back()->with('success', 'Ebook berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ebook $ebook)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ebook $ebook)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ebook $ebook)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'file' => 'nullable|mimes:pdf,epub|max:20480',
        ]);

        $data = [
            'title' => $request->title,
            'author' => $request->author,
            'category_id' => $request->category_id,
        ];

        if ($request->hasFile('file')) {
            // Hapus file lama jika ada file baru yang diunggah
            Storage::disk('public')->delete($ebook->file_path);

            $file = $request->file('file');
            $data['file_path'] = $file->store('ebooks', 'public');
            $data['format'] = $file->getClientOriginalExtension();
        }

        $ebook->update($data);

        return redirect()->back()->with('success', 'Ebook berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ebook $ebook)
    {
        // Hapus file fisik dari storage
        Storage::disk('public')->delete($ebook->file_path);

        // Hapus data dari database
        $ebook->delete();

        return redirect()->back()->with('success', 'Ebook berhasil dihapus.');
    }
}
