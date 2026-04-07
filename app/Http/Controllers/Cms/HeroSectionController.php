<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroSectionController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cms/Hero', [
            'heroes' => HeroSection::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'badge_text' => 'required|string|max:255',
            'title_line_1' => 'required|string|max:255',
            'title_highlight' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'stats_label' => 'nullable|string|max:255',
            'stats_value' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            // upload image
            if ($request->hasFile('image')) {
                $validated['image_path'] = $request->file('image')->store('hero-banners', 'public');
            }

            // default boolean
            $validated['is_active'] = $request->boolean('is_active');

            // hapus field image
            unset($validated['image']);

            HeroSection::create($validated);

            DB::commit();

            return redirect()->back()->with('success', 'Banner berhasil ditambahkan');
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menambahkan banner');
        }
    }

    public function update(Request $request, HeroSection $heroSection)
    {
        $validated = $request->validate([
            'badge_text' => 'required|string|max:255',
            'title_line_1' => 'required|string|max:255',
            'title_highlight' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'stats_label' => 'nullable|string|max:255',
            'stats_value' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            // upload image baru
            if ($request->hasFile('image')) {
                // hapus lama
                if ($heroSection->image_path) {
                    Storage::disk('public')->delete($heroSection->image_path);
                }

                $validated['image_path'] = $request->file('image')->store('hero-banners', 'public');
            }

            // handle boolean
            $validated['is_active'] = $request->boolean('is_active');

            unset($validated['image']);

            $heroSection->update($validated);

            DB::commit();

            return redirect()->back()->with('success', 'Banner berhasil diperbarui');
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal update banner');
        }
    }

    public function destroy(HeroSection $heroSection)
    {
        DB::beginTransaction();

        try {
            if ($heroSection->image_path) {
                Storage::disk('public')->delete($heroSection->image_path);
            }

            $heroSection->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Banner berhasil dihapus');
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menghapus banner');
        }
    }
}
