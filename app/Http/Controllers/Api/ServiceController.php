<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    /**
     * Mendapatkan daftar layanan yang aktif.
     */
    public function index()
    {
        try {
            $services = Service::where('is_active', true)
                ->orderBy('order', 'asc')
                ->get();

            return response()->json($services, 200);
        } catch (\Exception $e) {
            Log::error("Error fetching services: " . $e->getMessage());

            return response()->json([
                'message' => 'Gagal mengambil data layanan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
