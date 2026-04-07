import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns as BorrowingColumns } from "@/components/admin/borrow/columns";
import { DataTable } from '@/components/admin/borrow/data-table';
import AddBorrowingModal from '@/components/ui/admin/borrow/AddBorrowingModal';
import EditBorrowingModal from '@/components/ui/admin/borrow/EditBorrowingModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import borrowings from '@/routes/borrowings';
import borrowingsRoiute from '@/routes/borrowings';

// Tipe data disesuaikan dengan schema 'borrowings'
export interface Borrowing {
    id: number;
    member_id: number;
    book_id: number;
    borrow_date: string;
    due_date: string;
    return_date: string | null;
    status: 'dipinjam' | 'kembali' | 'terlambat';
    notes: string | null;
    member?: {
        library_card_number: string;
        memberable: { nama_lengkap?: string; user?: { name: string } };
    };
    book?: {
        title: string;
        isbn: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Peminjaman Buku',
        href: borrowingsRoiute.index().url,
    },
];

interface Props {
    borrowings: Borrowing[];
}

export default function BorrowingsIndex({ borrowings }: Props) {
    const [data, setData] = useState<Borrowing[]>(borrowings);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(null);

    useEffect(() => {
        setData(borrowings);
    }, [borrowings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Peminjaman" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sirkulasi Buku</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola peminjaman, pengembalian, dan pantau buku yang terlambat.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Catat Peminjaman Baru
                    </button>
                </div>

                {/* Ringkasan Status Peminjaman */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Total Transaksi</p>
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-blue-600 uppercase">Sedang Dipinjam</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {data.filter(b => b.status === 'dipinjam').length}
                        </p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-red-600 uppercase">Terlambat</p>
                        <p className="text-2xl font-bold text-red-600">
                            {data.filter(b => b.status === 'terlambat').length}
                        </p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-green-600 uppercase">Sudah Kembali</p>
                        <p className="text-2xl font-bold text-green-600">
                            {data.filter(b => b.status === 'kembali').length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-4">
                    <DataTable
                        columns={BorrowingColumns(setEditModalOpen, setSelectedBorrowing)}
                        data={data}
                    />
                </div>
            </div>

            {/* Modal untuk Edit/Update Status (Pengembalian) */}
            <EditBorrowingModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedBorrowing(null);
                }}
                borrowing={selectedBorrowing}
            />

            {/* Modal untuk Input Peminjaman Baru */}
            <AddBorrowingModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </AppLayout>
    );
}