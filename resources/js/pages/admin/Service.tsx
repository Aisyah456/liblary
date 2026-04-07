import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Layouts
import AppLayout from '@/layouts/app-layout';

// Components
import type { BreadcrumbItem } from '@/types';
import type { ReferenceService } from "@/components/admin/reference-service/columns";
import { columns } from "@/components/admin/reference-service/columns";
import { DataTable } from '@/components/admin/reference-service/data-table';
import AddReferenceServiceModal from '@/components/ui/admin/reference-service/AddReferenceServiceModal';
import EditReferenceServiceModal from '@/components/ui/admin/reference-service/EditReferenceServiceModal';
import references from '@/routes/references';

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Layanan Referensi',
        href:   references.index().url
    
    },
];

interface Props {
    referenceServices: ReferenceService[];
}

export default function ReferenceServicesIndex({ referenceServices }: Props) {
    const [data, setData] = useState<ReferenceService[]>(referenceServices);
    const [selectedService, setSelectedService] = useState<ReferenceService | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sync state ketika data dari props berubah (Inertia reload/partial reload)
    useEffect(() => {
        setData(referenceServices);
    }, [referenceServices]);

    const handleUpdate = (updatedService: ReferenceService) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedService.id ? updatedService : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Layanan Referensi" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Layanan Referensi</h1>
                        <p className="text-muted-foreground text-sm">
                            Pantau dan proses permintaan bantuan referensi dari mahasiswa/dosen.
                        </p>
                    </div>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm"
                    >
                        + Request Baru
                    </button>
                </header>

                <main className="bg-white rounded-lg border shadow-sm">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedService)}
                        data={data}
                    />
                </main>
            </div>

            {/* Modals Section */}

            {/* Modal Edit: Untuk update status (Pending -> Processing -> Completed) dan catatan pustakawan */}
            <EditReferenceServiceModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                referenceService={selectedService}
                onUpdate={handleUpdate}
            />

            {/* Modal Tambah: Jika pustakawan ingin menginput request secara manual */}
            <AddReferenceServiceModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}