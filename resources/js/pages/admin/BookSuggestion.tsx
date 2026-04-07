import { Head } from '@inertiajs/react';
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// Layouts & UI Components
import { DataTable } from '@/components/admin/scientific-work/data-table';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { columns } from "@/components/admin/suggestions/columns"; // Pastikan buat folder suggestions

// Modals (Pastikan buat file ini atau sesuaikan namanya)
import AddSuggestionModal from '@/components/ui/admin/suggestions/AddSuggestionModal';
import EditSuggestionModal from '@/components/ui/admin/suggestions/EditSuggestionModal';

// Types

// Interface sesuai database book_suggestions
export interface BookSuggestion {
    id: number;
    user_id: number;
    title: string;
    author: string;
    publisher: string | null;
    isbn: string | null;
    publication_year: number | null;
    reason: string | null;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    created_at: string;
    user?: { name: string }; // Jika ingin menampilkan nama pengusul
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Usulan Buku',
        href: '/admin/suggestions', // Sesuaikan route
    },
];

interface Props {
    suggestions: BookSuggestion[];
}

export default function SuggestionsIndex({ suggestions }: Props) {
    const [data, setData] = useState<BookSuggestion[]>(suggestions);
    const [selectedSuggestion, setSelectedSuggestion] = useState<BookSuggestion | null>(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        setData(Array.isArray(suggestions) ? suggestions : []);
    }, [suggestions]);

    const handleUpdate = (updated: BookSuggestion) => {
        setData((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Daftar Usulan Buku" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Usulan Buku Baru</h1>
                        <p className="text-muted-foreground text-sm">
                            Pantau dan kelola usulan koleksi buku dari mahasiswa dan dosen.
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
                        columns={columns(setEditModalOpen, setSelectedSuggestion)}
                        data={data}
                    />
                </main>
            </div>

            <EditSuggestionModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedSuggestion(null);
                }}
                suggestion={selectedSuggestion}
                onUpdate={handleUpdate}
            />

            <AddSuggestionModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}