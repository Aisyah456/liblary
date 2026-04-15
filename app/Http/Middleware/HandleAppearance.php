<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Mengambil profil pertama, jika tidak ada maka null
        $profile = \App\Models\LibraryProfile::first();

        // Pastikan data dikirim ke Inertia secara aman
        Inertia::share([
            'appearance' => [
                'title' => $profile->about_title ?? 'Default Title',
                'logo' => $profile->logo ?? '/default-logo.png',
                // Tambahkan data lainnya
            ],
        ]);

        return $next($request);
    }
}
