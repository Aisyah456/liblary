import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns as EbookColumns } from "@/components/admin/ebook/columns";
import { DataTable } from '@/components/admin/ebook/data-table';
import AddEbookModal from '@/components/ui/admin/ebook/AddEbookModal';
import EditEbookModal from '@/components/ui/admin/ebook/EditEbookModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import ebookRoute from '@/routes/ebooks';   


// Breadcrumbs disesuaikan untuk Ebook
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen E-Book',
        href: ebookRoute.index().url,
    },
];

// Interface disesuaikan dengan skema database ebooks
export interface Ebook {
    id: number;
    category_id: number;
    title: string;
    author: string;
    file_path: string;
    format: string;
    created_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Props {
    ebooks: Ebook[];
    categories: { id: number; name: string }[]; // Untuk dikirim ke modal tambah/edit
}

export default function EbooksIndex({ ebooks, categories }: Props) {
    const [data, setData] = useState<Ebook[]>(ebooks);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

    // Sinkronisasi data saat props dari server berubah
    useEffect(() => {
        setData(ebooks);
    }, [ebooks]);

    const handleUpdate = (updatedEbook: Ebook) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === updatedEbook.id ? updatedEbook : item
            )
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen E-Book" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Katalog E-Book</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola koleksi buku digital, kategori, dan file PDF/EPUB.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah E-Book
                    </button>
                </div>

                {/* Ringkasan Status E-Book */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-card border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Total Koleksi</p>
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="p-4 bg-card border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-blue-600 uppercase">Format PDF</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {data.filter(e => e.format.toLowerCase() === 'pdf').length}
                        </p>
                    </div>
                    <div className="p-4 bg-card border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-orange-600 uppercase">Format EPUB</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {data.filter(e => e.format.toLowerCase() === 'epub').length}
                        </p>
                    </div>
                    <div className="p-4 bg-card border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-green-600 uppercase">Kategori</p>
                        <p className="text-2xl font-bold text-green-600">
                            {/* Menghitung unik kategori yang ada di data saat ini */}
                            {[...new Set(data.map(e => e.category_id))].length}
                        </p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-4">
                    <DataTable
                        columns={EbookColumns(setEditModalOpen, setSelectedEbook)}
                        data={data}
                    />
                </div>
            </div>

            {/* Modal untuk Edit */}
            <EditEbookModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedEbook(null);
                }}
                ebook={selectedEbook}
                categories={categories} // Kirim data kategori untuk dropdown
                onUpdate={handleUpdate}
            />

            {/* Modal untuk Tambah */}
            <AddEbookModal
                isOpen={isAddModalOpen}
                categories={categories} // Kirim data kategori untuk dropdown
                onClose={() => setIsAddModalOpen(false)}
            />
        </AppLayout>
    );
}