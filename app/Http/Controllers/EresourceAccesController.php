<?php

namespace App\Http\Controllers;

use App\Models\EresourceAcces;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EresourceAccesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/Eresources', [
            'eresources' => EresourceAcces::with('user')->get(),
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
            'user_id' => 'required|exists:users,id',
            'resource_name' => 'required|string|max:255',
            'username_given' => 'nullable|string|max:255',
            'password_given' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date',
        ]);

        EresourceAcces::create($validated);

        return redirect()->back()->with('success', 'Akses e-resource berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(EresourceAcces $eresourceAcces)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EresourceAcces $eresourceAcces)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $eresource = EresourceAcces::findOrFail($id);

        $validated = $request->validate([
            'resource_name' => 'required|string|max:255',
            'username_given' => 'nullable|string|max:255',
            'password_given' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date',
        ]);

        $eresource->update($validated);

        return redirect()->back()->with('success', 'Akses e-resource berhasil diperbarui.');
    }

    /**
     * Menghapus data akses (Cabut Akses).
     */
    public function destroy($id)
    {
        $eresource = EresourceAcces::findOrFail($id);
        $eresource->delete();

        return redirect()->back()->with('success', 'Akses e-resource berhasil dihapus.');
    }
}
