import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AddStudentModal from '@/components/admin/student/AddStudentModal';
import type { Student} from '@/components/admin/student/columns';
import { columns } from '@/components/admin/student/columns';
import { DataTable } from '@/components/admin/student/data-table';
import EditStudentModal from '@/components/admin/student/EditStudentModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import studentRoute from '@/routes/student';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: studentRoute.index().url 
    },
];

interface StudentsProps {
    students: any[];
    faculties: any[]; // Data dari controller
    majors: any[];    // Data dari controller
}

export default function StudentsIndex({ students, faculties, majors }: StudentsProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

                {/* MODAL ADD: Memperbaiki typo majors */}
                <AddStudentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    faculties={faculties}
                    majors={majors} // <-- Tadi ada typo 'majorss'
                />

                <div className="bg-gray-100 border border-gray-200 rounded-md">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedStudent)}
                        data={students}
                    />
                </div>
            </div>

            {/* MODAL EDIT: Menambahkan props faculties dan majors yang hilang */}
            {selectedStudent && (
                <EditStudentModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedStudent(null);
                    }}
                    student={selectedStudent}
                    faculties={faculties} // <-- WAJIB DITAMBAHKAN
                    majors={majors}       // <-- WAJIB DITAMBAHKAN
                />
            )}
        </AppLayout>
    );
}