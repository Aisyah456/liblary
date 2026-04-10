<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class MessageController extends Controller
{
    /**
     * Menampilkan daftar pesan.
     */
    public function index()
    {
        return Inertia::render('admin/cms/Kontak', [
            'messages' => Message::orderBy('status', 'asc') // Penting: Pending muncul di atas
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    /**
     * Memperbarui balasan admin dan mengirim email.
     */
    public function update(Request $request, Message $message) // Menggunakan Route Model Binding
    {
        $request->validate([
            'balasan_admin' => 'required|string|min:5',
            'status' => 'required|in:pending,selesai',
        ]);

        try {
            $message->update([
                'balasan_admin' => $request->balasan_admin,
                'status' => $request->status,
                'tgl_dibalas' => now(),
            ]);


            return redirect()->back()->with('success', 'Balasan berhasil dikirim ke ' . $message->nama_lengkap);
        } catch (\Exception $e) {
            Log::error("Gagal update pesan: " . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses data.');
        }
    }

    public function destroy(Message $message) // Route Model Binding lebih praktis
    {
        try {
            $message->delete();
            return redirect()->back()->with('success', 'Pesan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus pesan.');
        }
    }
}
