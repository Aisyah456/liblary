<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LibraryFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class LibraryFeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $feedbacks = LibraryFeedback::latest()->get();
            return response()->json([
                'success' => true,
                'data'    => $feedbacks
            ], 200);
        } catch (\Exception $e) {
            Log::error("Gagal mengambil data feedback: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan server'], 500);
        }
    }

    public function store(Request $request)
    {
        // pastikan data yang masuk terbaca
        $validator = Validator::make($request->all(), [
            'category' => 'required|string',
            'rating'   => 'required|integer|between:1,5',
            'message'  => 'required|string|min:5',
            'type'     => 'nullable|string', // Ubah ke nullable agar tidak error jika React lupa mengirim
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $feedback = LibraryFeedback::create([
                'category' => $request->category,
                'rating'   => $request->rating,
                'message'  => $request->message,
                'type'     => $request->type ?? 'Saran/Aduan', // Fallback jika type null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback berhasil dikirim!',
                'data'    => $feedback
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error Simpan Feedback: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'error_detail' => $e->getMessage() // Ini akan memunculkan pesan error asli di React untuk sementara
            ], 500);
        }
    }

    /**
     * Menampilkan detail satu feedback berdasarkan ID.
     */
    public function show($id)
    {
        $feedback = LibraryFeedback::find($id);

        if (!$feedback) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $feedback], 200);
    }

    /**
     * Menghapus feedback (Biasanya untuk fitur moderasi admin).
     */
    public function destroy($id)
    {
        try {
            $feedback = LibraryFeedback::find($id);

            if (!$feedback) {
                return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
            }

            $feedback->delete();

            return response()->json([
                'success' => true,
                'message' => 'Feedback berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus feedback: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan server'], 500);
        }
    }

}