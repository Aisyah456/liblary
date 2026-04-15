<?php

namespace App\Http\Controllers\Api; // Update namespace

use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller; // Import base controller
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('layanan/kontak'); // Sesuaikan case-sensitive folder
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email',
            'subjek' => 'required|string|max:255',
            'pesan' => 'required|string',
        ]);

        // Simpan ke database (Pastikan model Message sudah ada)
        \App\Models\Message::create($validated);

        return redirect()->back()->with('success', 'Pesan Anda berhasil dikirim!');
    }
}
