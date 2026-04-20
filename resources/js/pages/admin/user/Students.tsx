import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react'; // Tambahkan useMemo
import { route } from 'ziggy-js';
import AddStudentModal from '@/components/admin/student/AddStudentModal';
import type { Student } from '@/components/admin/student/columns';
import { columns } from '@/components/admin/student/columns';
import { DataTable } from '@/components/admin/student/data-table';
import EditStudentModal from '@/components/admin/student/EditStudentModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// Perbaikan 1: Pastikan penamaan rute konsisten dengan web.php 
// Jika di web.php Route::resource('student',...), maka gunakan 'student.index'
// Jika di web.php Route::resource('students',...), maka gunakan 'students.index'

interface StudentsProps {
    students: never[]; // Ubah unknown ke any/Student jika memungkinkan
    faculties: never[];
    majors: never[];
}

export default function StudentsIndex({ students, faculties, majors }: StudentsProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Perbaikan 2: Masukkan breadcrumbs ke dalam komponen menggunakan useMemo
    // Ini mencegah error "route not found" saat inisialisasi awal jika Ziggy belum siap
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        {
            title: 'Students',
            href: route('student.index'), // Sesuaikan dengan list rute Anda (singular/plural)
        },
    ], []);

    const handleCloseEdit = () => {
        setEditModalOpen(false);
        // Jangan langsung null, beri sedikit delay agar animasi modal tutup selesai
        setTimeout(() => setSelectedStudent(null), 200);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Mahasiswa</h1>
                        <p className="text-sm text-muted-foreground">Kelola data mahasiswa dan informasi akademik.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                        <span className="text-lg">+</span> Tambah Mahasiswa
                    </Button>
                </div>

                <AddStudentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    faculties={faculties}
                    majors={majors}
                />

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden">
                    <DataTable
                        // Pastikan columns menerima fungsi dengan benar
                        columns={columns(setEditModalOpen, setSelectedStudent)}
                        data={students}
                    />
                </div>
            </div>

            {/* Perbaikan 3: EditStudentModal tetap dirender tapi dikontrol isOpen-nya 
                agar data student yang terpilih tidak hilang saat animasi penutupan */}
            <EditStudentModal
                isOpen={editModalOpen}
                onClose={handleCloseEdit}
                student={selectedStudent}
                faculties={faculties}
                majors={majors}
            />
        </AppLayout>
    );
}