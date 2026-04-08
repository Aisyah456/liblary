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
            'nama_lengkap' => 'required',
            'email' => 'required|email',
            'subjek' => 'required',
            'pesan' => 'required',
        ]);

        Message::create($validated);
        return Redirect::back()->with('success', 'Berhasil!');
    }
}
