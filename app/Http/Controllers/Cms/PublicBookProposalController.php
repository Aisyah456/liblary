<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BookProposal;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PublicBookProposalController extends Controller
{
    /**
     * Menampilkan halaman form usulan buku untuk publik.
     */
    public function create()
    {
        return Inertia::render('admin/PublicBook/BookProposalCmsPage', [
            'proposals' => BookProposal::latest()->get(),    
        'status_options' => ['mahasiswa', 'dosen', 'staf', 'umum', 'tamu'],
        ]);
    }

    /**
     * Menyimpan data usulan buku dari publik.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Identitas Pengusul
            'full_name'      => 'required|string|max:255',
            'identifier_id'  => 'nullable|string|max:50', // NIM/NIDN/NIK
            'email'          => 'required|email|max:255',
            'phone_number'   => 'nullable|string|max:20',
            'requester_type' => 'required|in:mahasiswa,dosen,staf,umum,tamu',
            'institution'    => 'nullable|string|max:255',

            // Detail Buku
            'title'          => 'required|string|max:255',
            'author'         => 'nullable|string|max:255',
            'publisher'      => 'nullable|string|max:255',
            'isbn'           => 'nullable|string|max:20',
            'publish_year'   => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),

            // Justifikasi
            'reason'         => 'required|string|min:10',
            'reference_link' => 'nullable|url',
        ], [
            'reason.min' => 'Mohon berikan alasan yang lebih jelas (minimal 10 karakter).',
            'publish_year.max' => 'Tahun terbit tidak valid.',
        ]);

        // Simpan ke database
        // Status otomatis menjadi 'pending' sesuai default migration
        BookProposal::create($validated);

        // Redirect kembali dengan pesan sukses
        return Redirect::back()->with('success', 'Usulan buku Anda berhasil dikirim! Tim pustakawan akan segera meninjaunya.');
    }
}
