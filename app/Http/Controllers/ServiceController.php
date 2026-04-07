<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Menampilkan daftar layanan.
     */
    public function index(): Response
    {
        return Inertia::render('admin/cms/Services', [
            'services' => Service::orderBy('order')->get(),
        ]);
    }

    /**
     * Simpan layanan baru
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request);

            Service::create($validated);

            return back()->with('success', 'Layanan berhasil ditambahkan!');
        } catch (\Throwable $e) {
            Log::error('Store Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Gagal menambah data layanan.',
            ]);
        }
    }

    /**
     * Update layanan
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        try {
            $validated = $this->validateRequest($request);

            $service->update($validated);

            return back()->with('success', 'Data layanan berhasil diperbarui!');
        } catch (\Throwable $e) {
            Log::error('Update Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'service_id' => $service->id,
            ]);

            return back()->withErrors([
                'error' => 'Terjadi kesalahan sistem saat memperbarui data.',
            ]);
        }
    }

    /**
     * Hapus layanan
     */
    public function destroy(Service $service): RedirectResponse
    {
        try {
            $service->delete();

            return back()->with('success', 'Data layanan berhasil dihapus.');
        } catch (\Throwable $e) {
            Log::error('Delete Service Error', [
                'message' => $e->getMessage(),
                'service_id' => $service->id,
            ]);

            return back()->withErrors([
                'error' => 'Gagal menghapus data layanan.',
            ]);
        }
    }

    /**
     * Centralized validation & sanitizing
     */
    private function validateRequest(Request $request): array
    {
        $validated = $request->validate([
            'icon' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string'],
            'link' => ['nullable', 'string'],
            'order' => ['required', 'integer'],
            'is_active' => ['required', 'boolean'],
        ]);

        // Bersihkan & normalize features
        $validated['features'] = collect($validated['features'] ?? [])
            ->filter(fn ($item) => trim($item) !== '')
            ->map(fn ($item) => trim($item))
            ->values()
            ->toArray();

        // Pastikan tidak null
        if (empty($validated['features'])) {
            $validated['features'] = [];
        }

        // Pastikan boolean aman
        $validated['is_active'] = (bool) $validated['is_active'];

        // Pastikan order integer
        $validated['order'] = (int) $validated['order'];

        return $validated;
    }
}
