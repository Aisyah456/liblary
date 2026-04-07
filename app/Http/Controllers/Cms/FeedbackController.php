<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\LibraryFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class FeedbackController extends Controller
{
    /**
     * Menampilkan daftar feedback
     */
    public function index()
    {
        $feedbacks = LibraryFeedback::latest()->get();

        return Inertia::render('admin/cms/Feedback', [
            'feedbacks' => $feedbacks
        ]);
    }

    /**
     * Menyimpan feedback baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'rating'   => 'required|integer|min:1|max:5',
            'message'  => 'required|string',
            'type'     => 'required|string|max:100',
        ]);

        LibraryFeedback::create($validated);

        return Redirect::back()->with('success', 'Feedback berhasil ditambahkan.');
    }

    /**
     * Memperbarui data feedback
     */
    public function update(Request $request, $id)
    {
        $feedback = LibraryFeedback::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'rating'   => 'required|integer|min:1|max:5',
            'message'  => 'required|string',
            'type'     => 'required|string|max:100',
        ]);

        $feedback->update($validated);

        return Redirect::back()->with('success', 'Feedback berhasil diperbarui.');
    }

    /**
     * Menghapus data feedback
     */
    public function destroy($id)
    {
        $feedback = LibraryFeedback::findOrFail($id);
        $feedback->delete();

        return Redirect::back()->with('success', 'Feedback berhasil dihapus.');
    }
}