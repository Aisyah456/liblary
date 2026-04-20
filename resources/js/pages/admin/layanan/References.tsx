// @ts-nocheck
import { Head } from '@inertiajs/react';
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// UI Components
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/admin/references/data-table';

// Modals & Table Config
import AddReferenceModal from '@/components/admin/references/AddReferenceModal';
import EditReferenceModal from '@/components/admin/references/EditReferenceModal';
import { columns } from "@/components/admin/references/columns";

// Types & Routes
import type { BreadcrumbItem } from '@/types';
import referencesRoute from "@/routes/references"; // Hilangkan .ts jika menggunakan Vite alias

// Interface
export interface BookSuggestion {
    id: number;
    user_id: number;
    title: string;
    author: string;
    publisher?: string;
    isbn?: string;
    publication_year?: string | number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    created_at: string;
    user?: { name: string };
}

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Layanan Perpustakaan', href: '#' },
    { title: 'Usulan Buku', href: referencesRoute.index().url },
];

interface Props {
    suggestions: BookSuggestion[];
}

export default function BookSuggestionsIndex({ suggestions }: Props) {
    const [data, setData] = useState<BookSuggestion[]>(suggestions);
    const [selectedSuggestion, setSelectedSuggestion] = useState<BookSuggestion | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sinkronisasi state saat props berubah
    useEffect(() => {
        setData(Array.isArray(suggestions) ? suggestions : []);
    }, [suggestions]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Usulan Buku" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Usulan Buku Mahasiswa
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Tinjau dan kelola permintaan pengadaan buku baru dari pengguna.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Usulan
                    </Button>
                </header>

                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        // Pastikan fungsi columns di file columns.tsx menerima 2 argumen ini
                        columns={columns(setEditModalOpen, setSelectedSuggestion)}
                        data={data}
                    />
                </main>
            </div>

            {/* --- Modals Section --- */}

            <EditReferenceModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedSuggestion(null);
                }}
                suggestion={selectedSuggestion}
            />

            <AddReferenceModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}