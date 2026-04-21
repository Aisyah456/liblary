import { Head } from '@inertiajs/react';
import { BookOpen, CheckCircle, Package, Clock } from 'lucide-react'; // Tambahkan icon untuk visual
import { useEffect, useState, useMemo } from 'react';
import { columns as BookColumns } from "@/components/admin/book/columns";
import { DataTable } from '@/components/admin/book/data-table';
import AddBookModal from '@/components/ui/admin/book/AddBookModal';
import EditBookModal from '@/components/ui/admin/book/EditBookModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import booksRoute from '@/routes/Books';
import BookController from '@/actions/App/Http/Controllers/BookController';

export interface Book {
    id: number;
    title: string;
    isbn: string | null;
    author: string;
    publisher: string | null;
    publication_year: number | null;
    genre: string | null;
    category: string | null;
    description: string | null;
    total_stock: number;
    available_stock: number;
    created_at?: string;
    updated_at?: string;
}


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Buku', href: BookController.index().url }, // Pastikan method index() mengembalikan URL yang benar
];

interface Props {
    books: Book[];
}

export default function BooksIndex({ books }: Props) {
    const [data, setData] = useState<Book[]>(books);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        setData(books);
    }, [books]);

    // Perhitungan statistik yang di-memoize
    const stats = useMemo(() => {
        const totalTitles = data.length;
        const totalPhysicalStock = data.reduce((acc, curr) => acc + (Number(curr.total_stock) || 0), 0);
        const available = data.reduce((acc, curr) => acc + (Number(curr.available_stock) || 0), 0);
        const borrowed = totalPhysicalStock - available;

        return [
            { label: 'Total Judul', value: totalTitles, icon: BookOpen, color: 'text-slate-600' },
            { label: 'Total Stok Fisik', value: totalPhysicalStock, icon: Package, color: 'text-green-600' },
            { label: 'Tersedia', value: available, icon: CheckCircle, color: 'text-blue-600' },
            { label: 'Dipinjam', value: borrowed, icon: Clock, color: 'text-orange-600' },
        ];
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Koleksi Buku" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Koleksi Buku</h1>
                        <p className="text-muted-foreground">
                            Kelola data buku, stok, dan informasi penerbitan secara terpusat.
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                            <div className={`rounded-lg bg-slate-50 p-2 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <DataTable
                        columns={BookColumns(setEditModalOpen, setSelectedBook)}
                        data={data}
                        onAddClick={() => setIsAddModalOpen(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            <EditBookModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedBook(null); // Bersihkan selection saat tutup
                }}
                book={selectedBook}
            />

            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </AppLayout>
    );
}