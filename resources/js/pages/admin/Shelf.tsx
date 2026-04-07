import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Layouts & UI Components
import type { Shelf } from "@/components/admin/shelf/columns";
import { columns } from "@/components/admin/shelf/columns";
import { DataTable } from '@/components/admin/shelf/data-table';
import AddShelfModal from '@/components/ui/admin/shelf/AddShelfModal';
import EditShelfModal from '@/components/ui/admin/shelf/EditShelfModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import shelfRoute from '@/routes/shelves';

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Manajemen Rak & Lokasi',
        href: shelfRoute.index().url,
    },
];

interface Props {
    shelves: Shelf[];
}

export default function ShelvesIndex({ shelves }: Props) {
    const [data, setData] = useState<Shelf[]>(shelves);
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);

    // UI States - Pisahkan state untuk Add dan Edit sesuai komponen yang diimport
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Sync state ketika data dari props berubah
    useEffect(() => {
        setData(shelves);
    }, [shelves]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Rak & Lokasi" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Rak & Lokasi Buku</h1>
                        <p className="text-muted-foreground text-sm">Kelola lokasi fisik penyimpanan koleksi perpustakaan.</p>
                    </div>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm"
                    >
                        + Tambah Rak
                    </button>
                </header>

                <main className="bg-white rounded-lg border shadow-sm">
                    {/* Fungsi columns sekarang memicu editModalOpen */}
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedShelf)}
                        data={data}
                    />
                </main>
            </div>

            {/* Modal Edit */}
            <EditShelfModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                shelf={selectedShelf}
                // Jika EditShelfModal Anda menggunakan onUpdate manual (bukan Inertia reload otomatis):
                onUpdate={(updatedShelf) => {
                    setData(prev => prev.map(s => s.id === updatedShelf.id ? updatedShelf : s));
                    setEditModalOpen(false);
                }}
            />

            {/* Modal Tambah */}
            <AddShelfModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}