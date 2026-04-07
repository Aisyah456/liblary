import { Head } from '@inertiajs/react';

// Layouts & UI Components
import { Plus, KeyRound } from "lucide-react";
import { useEffect, useState } from 'react';

// Modals - Disarankan rename file agar tidak membingungkan dengan 'Loans'
import AddEresourceModal from '@/components/admin/eresources/AddEresourcesModal';
import { columns } from "@/components/admin/eresources/columns";    // Path disesuaikan
import { DataTable } from '@/components/admin/eresources/data-table'; // Path disesuaikan
import EditEresourceModal from '@/components/admin/eresources/EditEresourcesModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';

// Types
import type { BreadcrumbItem } from '@/types';
import EresourceAccessRoute from '@/routes/ResourceAccessRoute';
import type { EresourceAccess } from '@/types/models';

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Akses E-Resource',
        href: 'admin/eresources',
    },
];

interface Props {
    // Nama prop ini harus sama dengan yang dikirim dari EresourceAccessController (Inertia::render)
    eresources: EresourceAccess[];
}

export default function EResourceIndex({ eresources }: Props) {
    const [data, setData] = useState<EresourceAccess[]>(eresources);
    const [selectedAccess, setSelectedAccess] = useState<EresourceAccess | null>(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        setData(Array.isArray(eresources) ? eresources : []);
    }, [eresources]);

    const handleUpdate = (updatedAccess: EresourceAccess) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedAccess.id ? updatedAccess : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Akses E-Resource" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-6 h-6 text-indigo-600" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Akun E-Resource
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Kelola pemberian akun database (IEEE, Scopus, dll) kepada pengguna.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Akses
                    </Button>
                </header>

                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        // Action: columns sekarang mengirim data akses ke modal edit
                        columns={columns(setEditModalOpen, setSelectedAccess)}
                        data={data}
                    />
                </main>
            </div>

            {/* Modal Edit */}
            <EditEresourceModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedAccess(null);
                }}
                // Pastikan di dalam modal ini, form diisi menggunakan selectedAccess
                resource={selectedAccess}
                onUpdate={handleUpdate}
            />

            {/* Modal Tambah */}
            <AddEresourceModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}