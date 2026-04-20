<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LibraryFree;
use App\Models\Faculty;
use App\Models\Major;
use App\Mail\LibraryFreeStatusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class LibraryFreeController extends Controller
{
    /**
     * Menampilkan daftar pengajuan untuk Admin
     */
    public function index()
    {
        return Inertia::render('admin/cms/LibraryFree', [
            'libraryFrees' => LibraryFree::with(['faculty', 'major'])
                ->orderBy('created_at', 'desc')
                ->paginate(10),
            'faculties' => Faculty::all(),
            'majors' => Major::all(),
        ]);
    }

    /**
     * Menyimpan data pengajuan dari mahasiswa
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'       => 'required|string|max:255',
            'nim'             => 'required|string|max:20|unique:library_frees,nim',
            'phone_number'    => 'required|string|max:20',
            'email'           => 'required|email|max:255',
            'faculty_id'      => 'required|exists:faculties,id',
            'major_id'        => 'required|exists:majors,id',
            'degree_level'    => 'required|string',
            'purpose'         => 'required|string', // Sesuaikan dengan opsi di Select React
            'entry_year'      => 'required|digits:4',
            'graduation_year' => 'required|digits:4',
            // Nama field disesuaikan dengan setData di React ("scientific_paper", bukan "_path")
            'scientific_paper' => 'required|file|mimes:pdf|max:10240',
            'ktm_scan'         => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'upload_proof'    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // 1. Proses Upload File & Ambil Path-nya
        if ($request->hasFile('scientific_paper')) {
            $validated['scientific_paper_path'] = $request->file('scientific_paper')->store('library/papers', 'public');
        }

        if ($request->hasFile('ktm_scan')) {
            $validated['ktm_scan_path'] = $request->file('ktm_scan')->store('library/ktm', 'public');
        }

        if ($request->hasFile('upload_proof')) {
            $validated['upload_proof_path'] = $request->file('upload_proof')->store('library/proofs', 'public');
        }

        // 2. Hapus key file mentah agar tidak error saat create ke database
        unset($validated['scientific_paper'], $validated['ktm_scan'], $validated['upload_proof']);

        // 3. Simpan ke Database
        LibraryFree::create($validated);

        return redirect()->back()->with('success', 'Pengajuan berhasil dikirim!');
    }

    /**
     * Update status pengajuan oleh Admin
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status'                    => 'required|in:pending,verifying,approved,rejected',
            'admin_notes'               => 'nullable|string',
            'turnitin_similarity_score' => 'nullable|numeric|min:0|max:100',
            'turnitin_report_url'       => 'nullable|url',
        ]);

        $libraryFree = LibraryFree::findOrFail($id);

        // Update data
        $libraryFree->update([
            'status'                    => $request->status,
            'admin_notes'               => $request->admin_notes,
            'turnitin_similarity_score' => $request->turnitin_similarity_score,
            'turnitin_report_url'       => $request->turnitin_report_url,
        ]);

        // Kirim Email Notifikasi jika status berubah (opsional: tambahkan pengecekan if status changed)
        try {
            Mail::to($libraryFree->email)->send(new LibraryFreeStatusMail($libraryFree));
        } catch (\Exception $e) {
            Log::error("Gagal mengirim email ke {$libraryFree->email}: " . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Status berhasil diperbarui.');
    }

    /**
     * Hapus data dan file terkait
     */
    public function destroy($id)
    {
        $libraryFree = LibraryFree::findOrFail($id);

        // Hapus file fisik jika ada
        $files = [
            $libraryFree->scientific_paper_path,
            $libraryFree->ktm_scan_path,
            $libraryFree->upload_proof_path
        ];

        foreach ($files as $file) {
            if ($file && Storage::disk('public')->exists($file)) {
                Storage::disk('public')->delete($file);
            }
        }

        $libraryFree->delete();

        return redirect()->back()->with('success', 'Data pengajuan berhasil dihapus.');
    }
}
