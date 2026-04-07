<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user sudah login
        // 2. Cek apakah kolom status di tabel users (misal: 'is_active') bernilai false/0
        if (Auth::check() && ! Auth::user()->is_active) {

            // Log out user tersebut
            Auth::logout();

            // Batalkan session
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Tendang kembali ke halaman login dengan pesan error
            return redirect()->route('login')->with('error', 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.');
        }

        return $next($request);
    }
}
