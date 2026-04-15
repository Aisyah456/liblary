<?php

namespace App\Http\Controllers;

use App\Mail\TurnitinResultMail;
use App\Models\Major;
use App\Models\Submission;
use App\Models\TurnitinResult;
use App\Models\TurnitinSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            'submissions' => TurnitinSubmission::with('major')->latest()->get(),
            'faculties' => Major::all(), // Asumsi data prodi diambil dari sini
        ]);
    }

    /**
     * Simpan Pengajuan Baru (Sub Menu 1)s
     */


    public function storeResult(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:turnitin_submissions,id',
            'similarity_percentage' => 'required|numeric|min:0|max:100',
            'verdict' => 'required|in:Lulus,Revisi,Ditolak',
            'check_date' => 'required|date',
            'evidence_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'librarian_notes' => 'nullable|string',
        ]);

        $submission = TurnitinSubmission::findOrFail($request->submission_id);

        // Tentukan status untuk DB (mapping dari verdict modal ke enum status migrasi)
        // Lulus -> completed | Revisi/Ditolak -> rejected
        $finalStatus = ($request->verdict === 'Lulus') ? 'completed' : 'rejected';

        if ($request->hasFile('evidence_file')) {
            $path = $request->file('evidence_file')->store('turnitin/results', 'private');
            $submission->result_file_path = $path;
        }

        $submission->update([
            'similarity_percentage' => $request->similarity_percentage,
            'status' => $finalStatus,
            'admin_notes' => $request->librarian_notes, // Menyimpan catatan ke kolom admin_notes
        ]);

        // Kirim Email via Mailable
        try {
            \Illuminate\Support\Facades\Mail::to($submission->email)
                ->send(new \App\Mail\TurnitinResultMail($submission));

            return redirect()->back()->with('success', 'Hasil berhasil diproses dan email terkirim!');
        } catch (\Exception $e) {
            return redirect()->back()->with('success', 'Data tersimpan, tapi email gagal: ' . $e->getMessage());
        }
    }

    /**
     * Simpan Hasil Pengecekan Turnitin (Sub Menu 2)
     */

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
