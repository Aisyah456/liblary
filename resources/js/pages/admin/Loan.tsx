// @ts-nocheck
import { Head } from '@inertiajs/react';

// Layouts & UI Components
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// Modals
import AddLoanModal from '@/components/admin/loans/AddLoanModal';
import { columns } from "@/components/admin/loans/columns"; // Pastikan path ini sesuai
import { DataTable } from '@/components/admin/loans/data-table'; // Pastikan path ini sesuai
import EditLoanModal from '@/components/admin/loans/EditLoanModal';
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';

// Types
import type { BreadcrumbItem } from '@/types';


// Sesuaikan interface dengan Schema DB Loans
export interface Loan {
    id: number;
    user_id: number;
    book_id: number;
    user?: { name: string }; // Relasi dari Controller
    book?: { title: string }; // Relasi dari Controller
    loan_date: string;
    due_date: string;
    return_date: string | null;
    fine_amount: number;
    status: 'active' | 'returned' | 'overdue';
    created_at?: string;
}

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Manajemen Peminjaman',
        href: loansRoute.index().url, 
    }, p
];

interface Props {
    loans: Loan[]; // Data yang dikirim dari LibraryClearanceController@index atau LoanController
}

export default function LoansIndex({ loans }: Props) {
    const [data, setData] = useState<Loan[]>(loans);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    // UI States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Sinkronisasi state saat data props berubah
    useEffect(() => {
        setData(Array.isArray(loans) ? loans : []);
    }, [loans]);

    // Update state lokal (optimistic update) setelah edit
    const handleUpdate = (updatedLoan: Loan) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedLoan.id ? updatedLoan : item))
        );
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Peminjaman Buku" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Peminjaman</h1>
                        <p className="text-muted-foreground text-sm">
                            Pantau sirkulasi buku, tanggal jatuh tempo, dan manajemen denda keterlambatan.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pinjaman Baru
                    </Button>
                </header>

                <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns(setEditModalOpen, setSelectedLoan)}
                        data={data || []}
                    />
                </main>
            </div>

            {/* --- Modals Section --- */}

            <EditLoanModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedLoan(null);
                }}
                loan={selectedLoan}
                onUpdate={handleUpdate}
            />

            <AddLoanModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </AppLayout>
    );
}