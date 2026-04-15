<?php

namespace App\Http\Controllers;

use App\Models\LibraryProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryProfileController extends Controller
{
    public function index(Request $request)
    {
        // Mengambil data pertama dari tabel library_profiles
        // Jika data tidak ada (belum di-seed), akan memunculkan error 404ca
        $profile = LibraryProfile::firstOrFail();

        return Inertia::render('profil/Index', [
            'profile' => $profile
        ]);
    }
}
