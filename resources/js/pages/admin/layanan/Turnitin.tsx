// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

// Layouts & UI Components
import AddTurnitinModal from '@/components/admin/turnitin/AddTurnitinModal';
import { columns } from "@/components/admin/turnitin/columns";
import { DataTable } from '@/components/admin/turnitin/data-table';
import ProcessTurnitinModal from '@/components/admin/turnitin/ProcessTurnitinModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';

// Components (Pastikan Anda menyesuaikan nama file/folder komponen ini)

// Types
import type { BreadcrumbItem } from '@/types';

// Interface sesuai Database Schema turnitin_submissions
export interface TurnitinSubmission {
    id: number;
    major_id: number;
    identifier_id: string; // NIM/NIDN
    full_name: string;
    email: string;
    title: string;
    document_type: string;
    file_path: string;
    academic_year: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    similarity_percentage?: number | null;
    result_file_path?: string | null;
    admin_notes?: string | null;
    created_at: string;
    major?: { name: string }; // Relasi prodi
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Layanan Perpustakaan',
        href: '#',
    },
    {
        title: 'Manajemen Turnitin',
        href: route('admin.turnitin.submissions.index'),
    },
];

interface Props {
    submissions: TurnitinSubmission[]; // Data dikirim dari Controller
}

export default function TurnitinManagementIndex({ submissions }: Props) {
    const [data, setData] = useState<TurnitinSubmission[]>(submissions);
    const [selectedSubmission, setSelectedSubmission] = useState<TurnitinSubmission | null>(null);

    // UI States
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sinkronisasi state saat data props dari Inertia berubah
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(Array.isArray(submissions) ? submissions : []);
    }, [submissions]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Cek Turnitin" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Antrian Cek Turnitin</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola pengajuan verifikasi orisinalitas dokumen mahasiswa dan dosen.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Input Manual
                    </Button>
                </header>

                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        // columns menerima state setter untuk aksi Edit/Proses di baris tabel
                        columns={columns(setProcessModalOpen, setSelectedSubmission)}
                        data={data || []}
                    />
                </main>
            </div>

            {/* --- Modals Section --- */}

            {/* Modal untuk Admin memproses pengajuan (Upload Hasil / Reject) */}
            <ProcessTurnitinModal
                isOpen={processModalOpen}
                onClose={() => {
                    setProcessModalOpen(false);
                    setSelectedSubmission(null);
                }}
                submission={selectedSubmission}
            />

            {/* Modal untuk menambah pengajuan baru dari sisi admin jika diperlukan */}
            <AddTurnitinModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}