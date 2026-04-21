// @ts-nocheck
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Layouts & Routes

// Components
import type { ScientificWork } from "@/components/admin/scientific-work/columns";
import { columns } from "@/components/admin/scientific-work/columns";
import { DataTable } from '@/components/admin/scientific-work/data-table';
import AddScientificWorkModal from '@/components/ui/admin/scientific-work/AddScientificWorkModal';
import EditScientificWorkModal from '@/components/ui/admin/scientific-work/EditScientificWorkModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import scientificWorkRoute from "@/routes/scientific-works";
import ScientificWorkController from '@/actions/App/Http/Controllers/ScientificWorkController';

// Tambahkan interface untuk Category
interface Category {
    id: number;
    name: string;
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Jurnal & Karya Ilmiah',
        href: ScientificWorkController.index().url, // Pastikan method index() mengembalikan URL yang benar
    },
];

interface Props {
    scientificWorks: ScientificWork[];
    categories: Category[]; // Terima categories dari Controller
}

export default function ScientificWorksIndex({ scientificWorks, categories }: Props) {
    const [data, setData] = useState<ScientificWork[]>(scientificWorks);
    const [selectedWork, setSelectedWork] = useState<ScientificWork | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sync state ketika data dari props berubah (Inertia reload)
    useEffect(() => {
        setData(scientificWorks);
    }, [scientificWorks]);

    const handleUpdate = (updatedWork: ScientificWork) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedWork.id ? updatedWork : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Jurnal & Karya Ilmiah" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Jurnal & Karya Ilmiah</h1>
                        <p className="text-muted-foreground text-sm">Kelola koleksi jurnal dan publikasi ilmiah di sini.</p>
                    </div>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm"
                    >
                        + Tambah Karya Ilmiah
                    </button>
                </header>

                <main className="bg-white rounded-lg border shadow-sm">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedWork)}
                        data={data}
                    />
                </main>
            </div>

            {/* Modals Section */}

            {/* Modal Edit: Sekarang menerima data categories dari props */}
            <EditScientificWorkModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                scientificWork={selectedWork}
                onUpdate={handleUpdate}
                categories={categories}
            />

            {/* Modal Tambah: Sekarang menerima data categories dari props */}
            <AddScientificWorkModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                categories={categories}
            />
        </AppLayout>
    );
}