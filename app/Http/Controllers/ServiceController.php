<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/cms/Services', [
            'services' => Service::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request);

            if ($request->hasFile('icon')) {
                $path = $request->file('icon')->store('services', 'public');
                $validated['icon'] = Storage::url($path);
            }

            Service::create($validated);

            return back()->with('success', 'Layanan baru berhasil diterbitkan!');
        } catch (\Throwable $e) {
            Log::error('Store Service Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menambah data layanan.']);
        }
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request, $service->id);

            if ($request->hasFile('icon')) {
                // Hapus ikon lama jika ada
                if ($service->icon) {
                    $oldPath = str_replace('/storage/', '', $service->icon);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('icon')->store('services', 'public');
                $validated['icon'] = Storage::url($path);
            } else {
                // Jika tidak upload file baru, gunakan ikon yang sudah ada
                unset($validated['icon']);
            }

            $service->update($validated);

            return back()->with('success', 'Perubahan layanan berhasil disimpan!');
        } catch (\Throwable $e) {
            Log::error('Update Service Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan sistem saat memperbarui data.']);
        }
    }

    public function destroy(Service $service): RedirectResponse
    {
        try {
            if ($service->icon) {
                $path = str_replace('/storage/', '', $service->icon);
                Storage::disk('public')->delete($path);
            }

            $service->delete();
            return back()->with('success', 'Layanan telah berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal menghapus data.']);
        }
    }

    private function validateRequest(Request $request, $id = null): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string'],
            'link' => ['nullable', 'string'],
            'order' => ['required', 'integer'],
            'is_active' => ['required', 'boolean'],
        ];

        // Jika Store: Ikon wajib file. Jika Update: Ikon boleh string (URL lama) atau file baru.
        if (!$id) {
            $rules['icon'] = ['required', 'image', 'mimes:jpg,jpeg,png,svg', 'max:2048'];
        } else {
            $rules['icon'] = ['nullable'];
        }

        $validated = $request->validate($rules);

        // Cleanup features
        $validated['features'] = collect($validated['features'] ?? [])
            ->filter(fn($item) => !empty(trim($item)))
            ->values()
            ->toArray();

        return $validated;
    }
}
