<?php

namespace App\Http\Controllers;

use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        // Mengambil data yang aktif dan sesuai urutan
        $services = Service::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        return response()->json($services);
    }
}
