<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cms/Partner', [
            'partners' => Partner::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:supplier,mitra,donator',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'email' => 'nullable|email|unique:partners,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'mou_number' => 'nullable|string|max:255',
            'partnership_expiry' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        }

        Partner::create($validated);

        return redirect()->back()->with('success', 'Partner berhasil ditambahkan.');
    }

    public function update(Request $request, Partner $partner)
    {
        // PENTING: Untuk Inertia + Upload File, gunakan POST dengan _method = PUT
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:supplier,mitra,donator',
            'logo' => 'nullable', // Validasi file dilakukan di bawah jika ada file baru
            'email' => 'nullable|email|unique:partners,email,' . $partner->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'mou_number' => 'nullable|string|max:255',
            'partnership_expiry' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            // Validasi manual jika ada file
            $request->validate(['logo' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);

            // Hapus logo lama
            if ($partner->logo) {
                Storage::disk('public')->delete($partner->logo);
            }
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        } else {
            // Jika tidak upload logo baru, jangan timpa kolom logo dengan null
            unset($validated['logo']);
        }

        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner berhasil diperbarui.');
    }

    public function destroy(Partner $partner)
    {
        if ($partner->logo) {
            Storage::disk('public')->delete($partner->logo);
        }

        $partner->delete();

        return redirect()->back()->with('success', 'Partner berhasil dihapus.');
    }
}
