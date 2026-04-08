<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    /**
     * Menampilkan daftar pesan.
     */
    public function index()
    {
        return Inertia::render('admin/cms/Kontak', [
            'messages' => Message::latest()->get()
        ]);
    }

    /**
     * Memperbarui balasan admin dan mengubah status.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'balasan_admin' => 'required|string|min:5',
            'status' => 'required|in:pending,selesai',
        ]);

        $message = Message::findOrFail($id);

        $message->update([
            'balasan_admin' => $request->balasan_admin,
            'status' => $request->status,
            'tgl_dibalas' => now(),
        ]);

        // Opsional: Tambahkan logika pengiriman email di sini jika diperlukan
        // Mail::to($message->email)->send(new ReplyMessageMail($message));

        return redirect()->back()->with('success', 'Pesan berhasil dibalas dan status diperbarui.');
    }

    /**
     * Menghapus pesan.
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return redirect()->back()->with('success', 'Pesan berhasil dihapus.');
    }
}
