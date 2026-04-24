<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\TurnitinResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/Turnitin/Submission', [
            'submissions' => Submission::with('result')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required',
            'identifier_id' => 'required',
            'title' => 'required',
            'document_type' => 'required',
            'file' => 'required|file|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('turnitin/submissions', 'private');
        }

        Submission::create([
            'user_id' => auth()->id(), // Ambil ID user yang sedang login
            'full_name' => $request->full_name,
            'identifier_id' => $request->identifier_id,
            'title' => $request->title,
            'document_type' => $request->document_type,
            'file_path' => $path,
        ]);

        Submission::create($validated);


        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Pengajuan berhasil dikirimkan ke sistem.'
        ]);
    }

    // Simpan Hasil Proses (ProcessTurnitinModal)
    public function storeResult(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'similarity_percentage' => 'required|numeric|min:0|max:100',
            'check_date' => 'required|date',
            'verdict' => 'required|in:Lulus,Revisi,Ditolak',
            'evidence_file' => 'required|file|mimes:pdf,jpg,png|max:5120',
        ]);

        // 1. Simpan File Bukti
        $evidencePath = $request->file('evidence_file')->store('turnitin/results', 'private');

        // 2. Simpan ke Tabel Results
        TurnitinResult::create([
            'submission_id' => $request->submission_id,
            'processed_by' => $request->user()->id,
            'similarity_percentage' => $request->similarity_percentage,
            'check_date' => $request->check_date,
            'librarian_notes' => $request->librarian_notes,
            'evidence_path' => $evidencePath,
            'verdict' => $request->verdict,
        ]);

        // 3. Update Status di Tabel Submissions
        Submission::where('id', $request->submission_id)->update([
            'status' => 'Completed',
        ]);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Hasil Turnitin untuk "' . Submission::find($request->submission_id)->title . '" telah diperbarui.'
        ]);
    }


    public function destroy($id)
    {
        // Pastikan mencari di model Submission, bukan TurnitinResult
        $submission = \App\Models\Submission::find($id);

        if (!$submission) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Gagal menghapus: Data tidak ditemukan.'
            ]);
        }

        // Hapus file fisik dari storage private agar tidak memenuhi server
        if ($submission->file_path && Storage::disk('private')->exists($submission->file_path)) {
            Storage::disk('private')->delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('message', [
            'type' => 'warning',
            'text' => 'Data pengajuan "' . $submission->title . '" berhasil dihapus.'
        ]);
    }
}
