import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

// PERBAIKAN: Mengimpor fungsi 'columns' sekaligus tipe 'LibraryFreeRow'
import React from 'react';
import AddLibraryFreeModal from '@/components/admin/libraryFree/AddLibraryFreeModal';
import { columns, type LibraryFreeRow } from '@/components/admin/libraryFree/columns';
import { DataTable } from '@/components/admin/libraryFree/data-table';
import EditLibraryFreeModal from '@/components/admin/libraryFree/EditLibraryFreeModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Faculty = {
    id: number;
    name: string;
};

type Major = {
    id: number;
    name: string;
    faculty_id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Bebas Pustaka', href: '/admin/bebas-pustaka' },
];

interface LibraryFreePageProps {
    libraryFrees: {
        data: LibraryFreeRow[];
        links: unknown;
        current_page: number;
        last_page: number;
        total: number;
    };
    faculties: Faculty[];
    majors: Major[];
}

export default function LibraryFreePage({ libraryFrees, faculties, majors }: LibraryFreePageProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<LibraryFreeRow | null>(null);

    const [addModalOpen, setAddModalOpen] = useState(false);

    const handleEdit = (item: LibraryFreeRow) => {
        setSelectedData(item);
        setEditModalOpen(true);
    };

    const handleCloseEdit = () => {
        setEditModalOpen(false);
        setTimeout(() => setSelectedData(null), 200);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Bebas Pustaka" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Bebas Pustaka</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Ditemukan <span className="font-semibold text-primary">{libraryFrees.total}</span> total pengajuan mahasiswa.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Pengajuan
                    </Button>
                </div>

                {/* Table Section */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/20">
                        {/* PERBAIKAN: Menghapus class 'italic' yang terduplikasi */}
                        <h2 className="text-sm font-medium text-muted-foreground italic">
                            *Gunakan kolom pencarian untuk memfilter NIM atau Nama Mahasiswa.
                        </h2>
                    </div>
                    <div className="p-4">
                        <DataTable
                            columns={columns(handleEdit)}
                            data={libraryFrees.data}
                            searchKey="full_name"
                        />
                    </div>
                </div>
            </div>

            <AddLibraryFreeModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                faculties={faculties}
                majors={majors}
            />

            {selectedData && (
                <EditLibraryFreeModal
                    isOpen={editModalOpen}
                    dataItem={selectedData}
                    onClose={handleCloseEdit}
                />
            )}
        </AppLayout>
    );
}