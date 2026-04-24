// @ts-nocheck
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Layouts & Routes

import type { LibraryClearance } from "@/components/admin/library-clearance/columns";
import { columns } from "@/components/admin/library-clearance/columns";
import { DataTable } from '@/components/admin/library-clearance/data-table';
import AddClearanceModal from '@/components/ui/admin/library-clearance/AddClearanceModal';
import EditClearanceModal from '@/components/ui/admin/library-clearance/EditClearanceModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import LibraryClearanceRoute from '@/routes/library-clearance';
import LibraryClearanceController from '@/actions/App/Http/Controllers/LibraryClearanceController';

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Layanan Perpustakaan',
        href: '#', // Ganti dengan route index jika ada
    },  
    {
        title: 'Bebas Pustaka',
        href: LibraryClearanceController.index().url,
    },
];

interface Props {
    clearances: LibraryClearance[];
}

export default function LibraryClearanceIndex({ clearances }: Props) {
    const [data, setData] = useState<LibraryClearance[]>(clearances);
    const [selectedClearance, setSelectedClearance] = useState<LibraryClearance | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sync state ketika data dari props berubah
    useEffect(() => {
        setData(clearances);
    }, [clearances]);

    const handleUpdate = (updatedItem: LibraryClearance) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Bebas Pustaka" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Surat Bebas Pustaka</h1>
                        <p className="text-muted-foreground text-sm">
                            Verifikasi pengembalian buku, denda, dan penerbitan sertifikat bebas pustaka.
                        </p>
                    </div>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm"
                    >
                        + Input Pengajuan Baru
                    </button>
                </header>

                <main className="bg-white rounded-lg border shadow-sm">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedClearance)}
                        data={data}
                    />
                </main>
            </div>

            {/* Modal Edit / Verifikasi */}
            <EditClearanceModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                clearance={selectedClearance}
                onUpdate={handleUpdate}
            />

            {/* Modal Tambah (Opsional jika admin bisa input manual) */}
            <AddClearanceModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}