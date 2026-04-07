<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\LibraryFree;
use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LibraryFreeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/bebasustaka/LibraryFree', [
            'submissions' => LibraryFree::with(['faculty', 'major'])->latest()->get(),
            'faculties' => Faculty::all(['id', 'name']), // Pastikan ini ada
            'majors' => Major::all(['id', 'name', 'faculty_id']), // Pastikan ini ada
        ]);
    }

    public function getMajors($facultyId)
    {
        $majors = Major::where('faculty_id', $facultyId)->get();

        return response()->json($majors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nim' => 'required|string|unique:library_frees,nim', // Pastikan nama tabel benar
            'faculty_id' => 'required|exists:faculties,id',
            'major_id' => 'required|exists:majors,id',
            'phone_number' => 'required|string',
            'email' => 'required|email',
            'degree_level' => 'required',
            'purpose' => 'required',
            'entry_year' => 'required|digits:4',
            'graduation_year' => 'required|digits:4',
            'scientific_paper' => 'required|mimes:pdf|max:10000',
            'ktm_scan' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'upload_proof' => 'nullable|mimes:pdf,jpg,png|max:2048',
        ]);

        // Proses Simpan File
        $paperPath = $request->file('scientific_paper')->store('library/papers', 'public');
        $ktmPath = $request->file('ktm_scan')->store('library/ktm', 'public');
        $proofPath = $request->hasFile('upload_proof')
            ? $request->file('upload_proof')->store('library/proofs', 'public')
            : null;

        LibraryFree::create([
            'full_name' => $validated['full_name'],
            'nim' => $validated['nim'],
            'faculty_id' => $validated['faculty_id'],
            'major_id' => $validated['major_id'],
            'phone_number' => $validated['phone_number'],
            'email' => $validated['email'],
            'degree_level' => $validated['degree_level'],
            'purpose' => $validated['purpose'],
            'entry_year' => $validated['entry_year'],
            'graduation_year' => $validated['graduation_year'],
            'scientific_paper_path' => $paperPath,
            'ktm_scan_path' => $ktmPath,
            'upload_proof_path' => $proofPath,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Permohonan berhasil ditambahkan.');
    }

    /**
     * Update untuk memproses Skor Turnitin & Status dari Modal Edit
     */
    public function update(Request $request, $id)
    {
        $submission = LibraryFree::findOrFail($id);

        $validated = $request->validate([
            'turnitin_similarity_score' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:pending,verifying,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $submission->update($validated);

        return redirect()->back()->with('success', 'Data Turnitin berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $submission = LibraryFree::findOrFail($id);

        // Hapus file fisik dari storage sebelum hapus database
        Storage::disk('public')->delete([
            $submission->scientific_paper_path,
            $submission->ktm_scan_path,
            $submission->upload_proof_path,
        ]);

        $submission->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
