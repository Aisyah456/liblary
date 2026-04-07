import { Head } from '@inertiajs/react';

// Layouts & UI Components
import { Plus, RefreshCcw, FileSearch } from "lucide-react";
import { useEffect, useState } from 'react';

// Modals
import TurnitinProcessController from '@/actions/App/Http/Controllers/TurnitinProcessController';
import AddSubmissionModal from '@/components/admin/turnitinProcess/AddSubmissionModal';
import { columns } from "@/components/admin/turnitinProcess/columns";
import { DataTable } from '@/components/admin/turnitinProcess/data-table';
import ProcessTurnitinModal from '@/components/admin/turnitinProcess/ProcessTurnitinModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
// Typesimp
import type { BreadcrumbItem } from '@/types';
import turnitinProcessRoute from '@/routes/submissions';

export interface TurnitinSubmission {
    id: number; 
    user_id: number;
    full_name: string;
    identifier_id: string; // NIM / NIDN
    title: string;
    document_type: 'Skripsi' | 'Tesis' | 'Artikel';
    file_path: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
    created_at: string;

    // Relasi hasil (HasOne) - Mengambil dari tabel turnitin_results
    result?: {
        id: number;
        similarity_percentage: number;
        check_date: string;
        librarian_notes: string;
        evidence_path: string; // Path PDF/Screenshot bukti
        verdict: 'Lulus' | 'Revisi' | 'Ditolak';
    };
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Manajemen Turnitin',
        href: '#',
    },  
    {
        title: 'Proses & Hasil',
            href: turnitinProcessRoute.index().url,
    },
];

interface Props {
    submissions: TurnitinSubmission[];
}

export default function TurnitinProcess({ submissions }: Props) {
    const [data, setData] = useState<TurnitinSubmission[]>(submissions);
    const [selectedSubmission, setSelectedSubmission] = useState<TurnitinSubmission | null>(null);

    // UI States
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sinkronisasi data saat props dari server berubah (Inertia reloads)
    useEffect(() => {
        setData(Array.isArray(submissions) ? submissions : []);
    }, [submissions]);

    // Update state lokal setelah aksi sukses (Optimistic UI)
    const handleUpdate = (updated: TurnitinSubmission) => {
        setData((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Proses & Hasil Turnitin" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileSearch className="h-6 w-6 text-indigo-600" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Proses Turnitin / Hasil Pengecekan
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Kelola unggahan dokumen, input persentase similarity, dan arsip bukti hasil pengecekan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                     

                        <Button
                            onClick={() => setAddModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Pengajuan Baru
                        </Button>
                    </div>
                </header>

                {/* Data Table Section */}
                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns(setProcessModalOpen, setSelectedSubmission)}
                        data={data}
                    />
                </main>
            </div>

            {/* --- Modals Section --- */}

            {/* Modal Input Hasil: Similarity, Tanggal, Catatan, & Bukti PDF */}
            <ProcessTurnitinModal
                isOpen={processModalOpen}
                onClose={() => {
                    setProcessModalOpen(false);
                    setSelectedSubmission(null);
                }}
                submission={selectedSubmission}
            />

            {/* Modal Tambah Pengajuan (Sub Menu 1) */}
            <AddSubmissionModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}