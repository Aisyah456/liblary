<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Major;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('admin/user/Students', [
            'students' => Student::with('user')->latest()->get(),
            'faculties' => Faculty::select('id', 'name', 'code')->get(), // Ambil kolom yang perlu saja
            'majors' => Major::select('id', 'faculty_id', 'name', 'code')->get(),
        ]);
    }

    /**
     * Menyimpan mahasiswa baru (Create).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'nim' => 'required|unique:students',
            'program_studi' => 'required|string|max:255',
            'fakultas' => 'required|string|max:255',
            'angkatan' => 'required|digits:4|integer',
            'no_telp' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'max_pinjam' => 'required|integer|min:1',
            'status' => 'required|in:Aktif,Nonaktif,Lulus,Cuti',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // 1. Buat User sebagai akun login
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => bcrypt($validated['nim']), // Default password pakai NIM
                ]);

                // 2. Buat profil Student yang berelasi ke user tadi
                $user->student()->create([
                    'nim' => $validated['nim'],
                    'program_studi' => $validated['program_studi'],
                    'fakultas' => $validated['fakultas'],
                    'angkatan' => $validated['angkatan'],
                    'no_telp' => $validated['no_telp'],
                    'alamat' => $validated['alamat'],
                    'max_pinjam' => $validated['max_pinjam'],
                    'status' => $validated['status'],
                ]);
            });

            return redirect()->back()->with('message', 'Mahasiswa berhasil ditambahkan!');
        } catch (\Exception $e) {
            Log::error('Store Student Error: '.$e->getMessage());

            return redirect()->back()->withErrors(['error' => 'Gagal menambah data mahasiswa.']);
        }
    }

    /**
     * Memperbarui data mahasiswa (Update).
     */
    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|unique:students,nim,'.$student->id,
            'program_studi' => 'required|string|max:255',
            'fakultas' => 'required|string|max:255',
            'angkatan' => 'required|digits:4|integer|min:1900|max:'.(date('Y') + 1),
            'no_telp' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'max_pinjam' => 'required|integer|min:1|max:10',
            'status' => 'required|in:Aktif,Nonaktif,Lulus,Cuti',
        ]);

        try {
            DB::transaction(function () use ($student, $validated) {
                // Update tabel users melalui relasi
                if ($student->user) {
                    $student->user->update(['name' => $validated['name']]);
                }

                // Update tabel students
                $student->update($validated);
            });

            return redirect()->back()->with('message', 'Data mahasiswa berhasil diperbarui!');
        } catch (\Exception $e) {
            Log::error('Update Student Error: '.$e->getMessage());

            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan sistem saat memperbarui data.']);
        }
    }

    /**
     * Menghapus mahasiswa (Delete).
     */
    public function destroy(Student $student): RedirectResponse
    {
        try {
            DB::transaction(function () use ($student) {
                $user = $student->user;
                $student->delete();

                if ($user) {
                    $user->delete();
                }
            });

            return redirect()->back()->with('message', 'Data mahasiswa berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Delete Student Error: '.$e->getMessage());

            return redirect()->back()->withErrors(['error' => 'Gagal menghapus data.']);
        }
    }
}
