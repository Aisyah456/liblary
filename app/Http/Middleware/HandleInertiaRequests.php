<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy; // 1. Pastikan Import ini ada!

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Auth Data
            'auth' => [
                'user' => $request->user(),
            ],

            // Flash Messages (Hanya untuk notifikasi)
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'message' => fn() => $request->session()->get('message'),
            ],

            // Ziggy (Harus diluar flash agar terbaca oleh library)
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },

            // Props tambahan lainnya jika diperlukan
            'name' => config('app.name'),
        ]);
    }
}
