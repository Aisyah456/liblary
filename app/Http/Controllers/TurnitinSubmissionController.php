<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\TurnitinSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurnitinSubmissionController extends Controller
{
    /**
     * Menampilkan form pengajuan (Frontend)
     */
    public function create()
    {
        // Tetap kirim data fakultas & prodi untuk dropdown di frontend
        $faculties = Faculty::with('majors')->get();

        return Inertia::render('layanan/ajuan-cek', [
            'faculties' => $faculties,
        ]);
    }

    /**
     * Proses simpan data pengajuan
     */
    public function store(Request $request)
    {
        $request->validate([
            'faculty_id'    => 'required|exists:faculties,id',
            'major_id'      => 'required|exists:majors,id',
            'identifier_id' => 'required|string|max:50',
            'full_name'     => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'title'         => 'required|string|max:500',
            'document_type' => 'required|string',
            'academic_year' => 'required|string|max:20',
            'file_path'     => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        try {
            $data = $request->only([
                'major_id',
                'identifier_id',
                'full_name',
                'email',
                'title',
                'document_type',
                'academic_year'
            ]);

            if ($request->hasFile('file_path')) {
                // Gunakan disk 'public' agar bisa diakses jika diperlukan
                $path = $request->file('file_path')->store('submissions/turnitin', 'public');
                $data['file_path'] = $path;
            }

            TurnitinSubmission::create($data);

            return redirect()->route('form-cek-turnitin.create')->with('message', [
                'type' => 'success',
                'text' => 'Pengecekan berhasil diajukan! Admin akan segera memproses dokumen Anda.'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['system' => 'Gagal menyimpan data.'])->with('message', [
                'type' => 'error',
                'text' => 'Terjadi kesalahan sistem.'
            ]);
        }
    }
}
