<?php

namespace App\Http\Controllers\Home;

use App\Models\Article;
use App\Models\Service;
use App\Models\HeroSection;
use App\Models\Partner; // Tambahkan import model Partner
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [
            'hero'     => HeroSection::where('is_active', true)->first(),
            'services' => Service::where('is_active', true)->orderBy('order')->get(),
            'articles' => Article::orderBy('created_at', 'desc')->take(6)->get(),
            // Tambahkan data partners di sini
            'partners' => Partner::where('is_active', true)
                ->select('id', 'name', 'logo') // Hanya ambil kolom yang diperlukan
                ->get(),
        ]);
    }
}
