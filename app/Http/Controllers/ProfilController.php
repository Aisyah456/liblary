<?php

namespace App\Http\Controllers;

use App\Models\LibraryProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cms/Profil', [
            'profiles' => LibraryProfile::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/cms/ProfilForm');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'about_title' => 'required|string|max:255',
            'about_description' => 'required|string',
            'vision' => 'required|string',
            'mission' => 'required|array',
            'total_books' => 'required|integer',
            'total_staff' => 'required|integer',
            'service_hours_weekday' => 'required|string',
            'service_hours_weekend' => 'required|string',
        ]);

        LibraryProfile::create($validated);

        return redirect()->route('admin.profile.index')->with('success', 'Profil berhasil dibuat');
    }

    /**
     * Menampilkan halaman edit (LibraryProfileEdit)
     */
    public function edit($id)
    {
        $profile = LibraryProfile::findOrFail($id);

        return Inertia::render('admin/cms/LibraryProfileEdit', [
            'profile' => $profile
        ]);
    }

    /**
     * Memproses pembaruan data
     */
    public function update(Request $request, $id)
    {
        $profile = LibraryProfile::findOrFail($id);

        $validated = $request->validate([
            'about_title' => 'required|string|max:255',
            'about_description' => 'required|string',
            'vision' => 'required|string',
            'mission' => 'required|array',
            'total_books' => 'required|integer',
            'total_staff' => 'required|integer',
            'service_hours_weekday' => 'required|string',
            'service_hours_weekend' => 'required|string',
        ]);

        $profile->update($validated);

        return redirect()->route('admin.profile.index')->with('success', 'Profil berhasil diperbarui');
    }

    public function show($id)
    {
        // Jika tidak butuh halaman detail, arahkan saja ke halaman edit
        return redirect()->route('admin.profile.edit', $id);
    }
    public function destroy($id)
    {
        LibraryProfile::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Profil berhasil dihapus');
    }
}
