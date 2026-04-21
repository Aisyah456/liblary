// @ts-nocheck
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AddLecturerModal from '@/components/admin/lecturer/AddLecturerModal';
import type { Lecturer} from '@/components/admin/lecturer/columns';
import { columns } from '@/components/admin/lecturer/columns';
import { DataTable } from '@/components/admin/lecturer/data-table';
import EditLecturerModal from '@/components/admin/lecturer/EditLecturerModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
// Sesuaikan import path ke folder lecturer
import lecturerRoute from '@/routes/lecturers'; // Pastikan route ini ada
import LecturerController from '@/actions/App/Http/Controllers/LecturerController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lecturers',
        href: LecturerController.index().url, // Pastikan method index() mengembalikan URL yang benar
    },
];

interface LecturersProps {
    lecturers: any[];
    majors: any[]; // Mengganti faculties jika dosen hanya terkait dengan program studi
}

export default function LecturersIndex({ lecturers, majors }: LecturersProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lecturers" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Dosen</h1>
                        <p className="text-sm text-muted-foreground">Kelola data dosen dan informasi fungsional.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                        <span className="text-lg">+</span> Tambah Dosen
                    </Button>
                </div>

                <AddLecturerModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    majors={majors}
                />

                <div className="bg-gray-100 border border-gray-200 rounded-md">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedLecturer)}
                        data={lecturers}
                    />
                </div>
            </div>

            {selectedLecturer && (
                <EditLecturerModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedLecturer(null);
                    }}
                    lecturer={selectedLecturer}
                    majors={majors}
                />
            )}
        </AppLayout>
    );
}