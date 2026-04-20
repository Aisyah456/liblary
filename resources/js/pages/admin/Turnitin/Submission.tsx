// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Head } from '@inertiajs/react';

// Layouts & UI Components
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// Modals (Pastikan buat file ini nanti)
import { columns } from "@/components/admin/turnitin/columns";
import { DataTable } from '@/components/admin/turnitin/data-table';
import ProcessTurnitinModal from '@/components/admin/turnitin/ProcessTurnitinModal';
import AddSubmissionModal from '@/components/admin/turnitinProcess/AddSubmissionModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';

// Types
import type { BreadcrumbItem } from '@/types';
import SubmissionsRoute from '@/routes/submissions';

// Interface disesuaikan dengan skema gabungan Submission & TurnitinResult
export interface TurnitinSubmission {
    id: number;
    user_id: number;
    full_name: string;
    user_name?: string;
    identifier_id: string; // NIM / NIDN
    title: string;
    document_type: 'Skripsi' | 'Tesis' | 'Artikel';
    file_path: string;
    status:[ 'Pending' | 'Processing' | 'Completed' | 'Rejected'];
    created_at: string; // Tanggal Pengajuan

    // Relasi hasil (HasOne)
    result?: {
        id: number;
        similarity_percentage: number;
        check_date: string;
        librarian_notes: string;
        evidence_path: string;
    };
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Turnitin',
        href: SubmissionsRoute.index().url,
    },
];  

interface Props {
    submissions: TurnitinSubmission[];
}

export default function TurnitinIndex({ submissions }: Props) {
    const [data, setData] = useState<TurnitinSubmission[]>(submissions);
    const [selectedSubmission, setSelectedSubmission] = useState<TurnitinSubmission | null>(null);

    // UI States
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sync props ke state
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(Array.isArray(submissions) ? submissions : []);
    }, [submissions]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Daftar Pengajuan Turnitin" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Manajemen Pengajuan Turnitin
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola antrean cek plagiarisme mahasiswa dan dosen secara terintegrasi.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pengajuan
                    </Button>
                </header>

                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns(setProcessModalOpen, setSelectedSubmission)}
                        data={data || []}
                    />
                </main>
            </div>

            {/* Modal untuk Input Hasil Turnitin (Sub Menu 2) */}
            <ProcessTurnitinModal
                isOpen={processModalOpen}
                onClose={() => {
                    setProcessModalOpen(false);
                    setSelectedSubmission(null);
                }}
                submission={selectedSubmission}
            />

            {/* Modal untuk Pengajuan Baru (Sub Menu 1) */}
            <AddSubmissionModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}