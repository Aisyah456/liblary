<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\TurnitinResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TurnitinProcessController extends Controller
{
    /**
     * Tampilkan daftar pengajuan & hasil (Eager Loading)
     */
    public function index()
    {
        return Inertia::render('admin/Turnitin/TurnitinProcess', [
            'submissions' => Submission::with(['result', 'user'])->latest()->get(),
        ]);
    }

    /**
     * Simpan Pengajuan Baru (Sub Menu 1)s
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'identifier_id' => 'required|string|max:50',
            'title' => 'required|string|max:500',
            'document_type' => 'required|in:Skripsi,Tesis,Artikel',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB
        ]);

        if ($request->hasFile('file')) {
            // Simpan file asli di folder private
            $validated['file_path'] = $request->file('file')->store('turnitin/submissions', 'private');
        }

        // Set status awal sebagai Pending
        $validated['status'] = 'Pending';
        $validated['user_id'] = auth()->id();

        Submission::create($validated);

        return redirect()->back()->with('success', 'Pengajuan berhasil ditambahkan.');
    }

    /**
     * Simpan Hasil Pengecekan Turnitin (Sub Menu 2)
     */
    public function storeResult(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'similarity_percentage' => 'required|numeric|min:0|max:100',
            'check_date' => 'required|date',
            'verdict' => 'required|in:Lulus,Revisi,Ditolak',
            'evidence_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB
            'librarian_notes' => 'nullable|string',
        ]);

        // 1. Simpan Bukti Hasil (PDF/Screenshot)
        $evidencePath = $request->file('evidence_file')->store('turnitin/evidence', 'private');

        // 2. Gunakan updateOrCreate untuk data Result
        TurnitinResult::updateOrCreate(
            ['submission_id' => $request->submission_id],
            [
                'similarity_percentage' => $request->similarity_percentage,
                'check_date' => $request->check_date,
                'librarian_notes' => $request->librarian_notes,
                'evidence_path' => $evidencePath,
                'processed_by' => auth()->id(),
                'verdict' => $request->verdict,
            ]
        );

        // 3. Update status di tabel Submission menjadi Completed
        Submission::where('id', $request->submission_id)->update([
            'status' => 'Completed',
        ]);

        return redirect()->back()->with('success', 'Hasil Turnitin berhasil diperbarui.');
    }

    /**
     * Download File Dokumen Private
     */
    public function downloadFile($id)
    {
        $submission = Submission::findOrFail($id);

        if (! Storage::disk('private')->exists($submission->file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('private')->downloadFile($submission->file_path);
    }

    /**
     * Hapus Pengajuan & Hasilnya
     */
    public function destroy($id)
    {
        $submission = Submission::findOrFail($id);

        // Hapus file fisik jika ada
        if ($submission->file_path) {
            Storage::disk('private')->delete($submission->file_path);
        }

        // Relasi hasil akan otomatis terhapus jika Anda menggunakan onCascade di migrasi
        $submission->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
