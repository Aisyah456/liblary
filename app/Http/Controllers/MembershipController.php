<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use App\Models\Membership;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with(['memberable' => function ($query) {
            $query->morphWith([
                Student::class => ['user'],
                Lecturer::class => ['user'],
            ]);
        }])->latest()->get();

        $availableStudents = Student::whereDoesntHave('membership')->with('user')->get();
        $availableLecturers = Lecturer::whereDoesntHave('membership')->get();

        return Inertia::render('admin/user/Membership', [
            'memberships' => $memberships,
            'availableMembers' => [
                'students' => $availableStudents,
                'lecturers' => $availableLecturers,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'memberable_id' => 'required|integer',
            'memberable_type' => 'required|string', // Contoh: "App\Models\Student"
            'library_card_number' => 'required|unique:memberships,library_card_number',
            'joined_at' => 'required|date',
            'expires_at' => 'nullable|date|after:joined_at',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        Membership::create($validated);

        return redirect()->back()->with('success', 'Anggota berhasil didaftarkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Membership $membership)
    {
        $validated = $request->validate([
            'library_card_number' => 'required|unique:memberships,library_card_number,'.$membership->id,
            'status' => 'required|in:Aktif,Nonaktif',
            'joined_at' => 'required|date',
            'expires_at' => 'nullable|date|after:joined_at',
        ]);

        $membership->update($validated);

        if (in_array($membership->memberable_type, [Student::class, Lecturer::class])) {
            $membership->memberable()->update([
                'status' => $request->status === 'Aktif' ? 'Aktif' : 'Nonaktif',
            ]);
        }

        return redirect()->back()->with('success', 'Data keanggotaan diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Membership $membership)
    {
        $membership->delete();

        return redirect()->back()->with('success', 'Keanggotaan berhasil dihapus.');
    }
}
