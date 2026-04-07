<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/user/Lecturers', [
            'lecturers' => Lecturer::latest()->get(),
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
            'nidn' => 'required|string|max:20|unique:lecturers,nidn',
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers,email',
            'jenis_kelamin' => 'required|in:L,P',
            'program_studi' => 'required|string|max:255',
            'jabatan_fungsional' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:15',
        ]);

        Lecturer::create($validated);

        return redirect()->back()->with('success', 'Dosen berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lecturer $lecturer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lecturer $lecturer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lecturer $lecturer)
    {
        $validated = $request->validate([
            'nidn' => 'required|string|max:20|unique:lecturers,nidn,'.$lecturer->id,
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers,email,'.$lecturer->id,
            'jenis_kelamin' => 'required|in:L,P',
            'program_studi' => 'required|string|max:255',
            'jabatan_fungsional' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:15',
        ]);

        $lecturer->update($validated);

        // Mengirimkan data terbaru agar state di frontend (onUpdate) terupdate
        return redirect()->back()->with([
            'success' => 'Data dosen berhasil diperbarui.',
            'lecturer' => $lecturer, // Mengirim kembali objek yang diupdate
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lecturer $lecturer)
    {
        $lecturer->delete();

        return redirect()->back()->with('success', 'Dosen berhasil dihapus.');
    }
}
