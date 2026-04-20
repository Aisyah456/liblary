<?php

namespace App\Http\Controllers;

use App\Models\Major;
use App\Models\TurnitinSubmission;
use App\Models\TurnitinResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TurnitinProcessController extends Controller
{
    /**
     * Tampilkan daftar pengajuan & hasil
     */
    public function index()
    {
        return Inertia::render('admin/Turnitin/TurnitinProcess', [
            // Eager load 'result' untuk melihat apakah sudah diproses
            'submissions' => TurnitinSubmission::with(['major', 'result'])->latest()->get(),
            'majors' => Major::all(),
        ]);
    }

    /**
     * Simpan Hasil Pengecekan (Proses dari Pustakawan)
     */
    public function storeResult(Request $request)
    {
        $request->validate([
            'submission_id'         => 'required|exists:turnitin_submissions,id',
            'similarity_percentage' => 'required|numeric|min:0|max:100',
            'verdict'               => 'required|in:Lulus,Revisi,Ditolak',
            'check_date'            => 'required|date',
            'evidence_file'         => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'librarian_notes'       => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $submission = TurnitinSubmission::findOrFail($request->submission_id);

            // 1. Upload File Bukti (Evidence)
            $path = $request->file('evidence_file')->store('turnitin/evidence', 'public');

            // 2. Simpan ke tabel turnitin_results (Sesuai Migration baru)
            $result = TurnitinResult::create([
                'submission_id'         => $request->submission_id,
                'processed_by'          => auth()->id(), // ID Pustakawan yang login
                'similarity_percentage' => $request->similarity_percentage,
                'check_date'            => $request->check_date,
                'librarian_notes'       => $request->librarian_notes,
                'evidence_path'         => $path,
                'verdict'               => $request->verdict,
            ]);

            // 3. Update status di tabel utama (turnitin_submissions)
            $finalStatus = ($request->verdict === 'Lulus') ? 'completed' : 'rejected';
            $submission->update(['status' => $finalStatus]);

            // 4. Kirim Email
            try {
                // Pastikan TurnitinResultMail menerima objek $result atau $submission
                Mail::to($submission->email)->send(new \App\Mail\TurnitinResultMail($submission, $result));

                return redirect()->back()->with('success', 'Hasil berhasil diproses dan email terkirim!');
            } catch (\Exception $e) {
                return redirect()->back()->with('success', 'Data tersimpan, tapi email gagal: ' . $e->getMessage());
            }
        });
    }

    /**
     * Download File Dokumen Original dari Mahasiswa
     */
    public function downloadFile($id)
    {
        $submission = TurnitinSubmission::findOrFail($id);

        // Check existence on the specific disk
        if (!Storage::disk('private')->exists($submission->file_path)) {
            abort(404, 'File dokumen tidak ditemukan.');
        }

        // Correct method is download()
        return Storage::disk('private')->download($submission->file_path);
    }

    /**
     * Hapus Pengajuan
     */
    public function destroy($id)
    {
        $submission = TurnitinSubmission::findOrFail($id);

        // Hapus file dokumen asli
        if ($submission->file_path) {
            Storage::disk('private')->delete($submission->file_path);
        }

        // Jika ada file bukti di tabel result, hapus juga
        if ($submission->result && $submission->result->evidence_path) {
            Storage::disk('public')->delete($submission->result->evidence_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
