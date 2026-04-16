import { Head } from '@inertiajs/react';
import { useState } from 'react';
// Sesuaikan path ini dengan folder asli Anda (apakah libraryFree atau library-free)
import { columns } from '@/components/admin/libraryFree/columns';
import type { LibraryFreeRow } from '@/components/admin/libraryFree/columns';
import EditLibraryFreeModal from '@/components/admin/libraryFree/EditLibraryFreeModal';
import { DataTable } from '@/components/admin/libraryFree/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Bebas Pustaka', href: '/admin/bebas-pustaka' },
];

interface LibraryFreePageProps {
    libraryFrees: LibraryFreeRow[]; 
}

export default function LibraryFreePage({ libraryFrees }: LibraryFreePageProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<LibraryFreeRow | null>(null);

    // Fungsi untuk membuka modal edit
    const handleEdit = (item: LibraryFreeRow) => {
        setSelectedData(item);
        setEditModalOpen(true);
    };

    // Fungsi untuk menutup modal dan membersihkan data terpilih
    const handleCloseModal = () => {
        setEditModalOpen(false);
        setTimeout(() => setSelectedData(null), 200); // Delay halus agar transisi modal selesai dulu
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Bebas Pustaka" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Bebas Pustaka</h1>
                        <p className="text-sm text-muted-foreground">
                            Verifikasi dokumen kelulusan, cek skor Turnitin, dan kelola status validasi mahasiswa.
                        </p>
                    </div>
                    {/* Tombol tambah ditiadakan karena data berasal dari input mahasiswa */}
                </div>

                <div className="rounded-md border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    <DataTable
                        columns={columns(handleEdit)}
                        data={libraryFrees}
                        searchKey="full_name" 
                    />
                </div>
            </div>

            {/* Modal untuk Verifikasi/Edit Status */}
            {selectedData && (
                <EditLibraryFreeModal
                    isOpen={editModalOpen}
                    dataItem={selectedData}
                    onClose={handleCloseModal}
                />
            )}
        </AppLayout>
    );
}