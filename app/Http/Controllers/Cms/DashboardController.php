<?php

namespace App\Http\Controllers\Cms; // Namespace menyesuaikan folder

use App\Http\Controllers\Controller;
use App\Models\LibraryProfile;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $profile = LibraryProfile::first();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_books' => $profile->total_books ?? 0,
                'total_staff' => $profile->total_staff ?? 0,
                'library_name' => $profile->about_title ?? 'Perpustakaan',
            ],
        ]);
    }
}
