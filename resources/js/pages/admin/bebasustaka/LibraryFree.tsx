import { Head } from '@inertiajs/react';

// Layouts & UI Components
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// Modals
import AddLibraryFreeModal from '@/components/admin/libraryFree/AddLibraryFreeModal';
import { columns } from "@/components/admin/libraryFree/columns";
import { DataTable } from '@/components/admin/libraryFree/data-table';
import EditLibraryFreeModal from '@/components/admin/libraryFree/EditLibraryFreeModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
// Types
import type { BreadcrumbItem } from '@/types';
import LibraryFreesRoute  from '@/routes/libraryFrees';

// Interface sesuai Database Schema library_frees
export interface LibraryFree {
    id: number;
    full_name: string;
    nim: string;
    phone_number: string;
    email: string;
    faculty_id: number;
    major_id: number;
    faculty?: { name: string }; // Relasi ke table faculties
    major?: { name: string };   // Relasi ke table majors
    degree_level: string;
    purpose: string;
    entry_year: number | string;
    graduation_year: number | string;
    scientific_paper_path: string;
    ktm_scan_path: string;
    upload_proof_path?: string;
    turnitin_similarity_score?: number;
    turnitin_report_url?: string;
    status: 'pending' | 'verifying' | 'approved' | 'rejected';
    admin_notes?: string;
    created_at: string;
}

interface Faculty {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
    faculty_id: number;
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Layanan Perpustakaan',
        href: '#',
    },
    {
        title: 'Bebas Pustaka',
        href: LibraryFreesRoute.index().url,
    },
];

interface Props {
    submissions: LibraryFree[]; // Data list permohonan dari Controller
    faculties: Faculty[];       // Data fakultas untuk dropdown
    majors: Major[];           // Data jurusan untuk dropdown
}

export default function LibraryFreeIndex({ submissions, faculties, majors }: Props) {
    const [data, setData] = useState<LibraryFree[]>(submissions);
    const [selectedItem, setSelectedItem] = useState<LibraryFree | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sinkronisasi state saat data props dari Inertia berubah (re-render)
    useEffect(() => {
        setData(Array.isArray(submissions) ? submissions : []);
    }, [submissions]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Bebas Pustaka" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Validasi Bebas Pustaka</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola verifikasi karya ilmiah, cek Turnitin, dan status bebas pustaka mahasiswa.
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
                        // columns harus menerima setter untuk membuka modal edit dan memilih row
                        columns={columns(setEditModalOpen, setSelectedItem)}
                        data={data || []}
                    />
                </main>
            </div>

            {/* --- Modals Section --- */}

            {/* Modal untuk Admin Memproses (Update Status/Score Turnitin) */}
            <EditLibraryFreeModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedItem(null);
                }}
                dataItem={selectedItem}
            />

            {/* Modal untuk Menambah pengajuan baru (Input data mhs + upload file) */}
            <AddLibraryFreeModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                faculties={faculties}
                majors={majors}
            />
        </AppLayout>
    );
}