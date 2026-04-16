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
class LibraryFreeController extends Controller
{
    /**
     * Menampilkan form untuk mahasiswa (Public)
     */
    public function create()
    {
        return Inertia::render('LibraryFreeForm', [
            'faculties' => Faculty::all(),
            'majors' => Major::all(),
        ]);
    }

    /**
     * Menyimpan data pengajuan dari mahasiswa
     * Method ini menangani route 'library-free.store'
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'             => 'required|string|max:255',
            'nim'                   => 'required|string|max:20',
            'phone_number'          => 'required|string|max:20',
            'email'                 => 'required|email|max:255',
            'faculty_id'            => 'required|exists:faculties,id',
            'major_id'              => 'required|exists:majors,id',
            'degree_level'          => 'required|string',
            'purpose'               => 'required|in:Yudisium,Wisuda,Pindah',
            'entry_year'            => 'required|digits:4',
            'graduation_year'       => 'required|digits:4',
            'scientific_paper_path' => 'required|file|mimes:pdf|max:10240', // Max 10MB
            'ktm_scan_path'         => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'upload_proof_path'     => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Proses Upload File
        $validated['scientific_paper_path'] = $request->file('scientific_paper_path')->store('library/papers', 'public');
        $validated['ktm_scan_path']         = $request->file('ktm_scan_path')->store('library/ktm', 'public');
        $validated['upload_proof_path']     = $request->file('upload_proof_path')->store('library/proofs', 'public');

        $validated['status'] = 'pending';

        LibraryFree::create($validated);

        return redirect()->back()->with('success', 'Pengajuan berhasil dikirim!');
    }

    /**
     * Menampilkan daftar pengajuan (Admin CMS)
     */
    public function index()
    {
        $libraryFrees = LibraryFree::with(['faculty', 'major'])
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Gunakan paginate untuk data banyak

        return Inertia::render('admin/cms/LibraryFree', [
            'libraryFrees' => $libraryFrees
        ]);
    }

    /**
     * Update status pengajuan dan kirim email
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,verifying,approved,rejected',
            'admin_notes' => 'nullable|string',
            'turnitin_similarity_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $libraryFree = LibraryFree::findOrFail($id);
        $libraryFree->update($request->only(['status', 'admin_notes', 'turnitin_similarity_score']));

        // Kirim Email Notifikasi
        try {
            Mail::to($libraryFree->email)->send(new LibraryFreeStatusMail($libraryFree));
        } catch (\Exception $e) {
            \Log::error("Gagal mengirim email ke {$libraryFree->email}: " . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Status berhasil diperbarui.');
    }

    /**
     * Hapus data dan file terkait
     */
    public function destroy($id)
    {
        $libraryFree = LibraryFree::findOrFail($id);

        // Hapus file fisik dari storage agar tidak memenuhi server
        Storage::disk('public')->delete([
            $libraryFree->scientific_paper_path,
            $libraryFree->ktm_scan_path,
            $libraryFree->upload_proof_path
        ]);

        $libraryFree->delete();

        return redirect()->back()->with('success', 'Data dan file berhasil dihapus.');
    }
}
