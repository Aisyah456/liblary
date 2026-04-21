import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import AddMembershipModal from '@/components/admin/membership/AddMembershipModal';
import { columns as MembershipColumns } from "@/components/admin/membership/columns";
import type { Membership as MembershipRow } from "@/components/admin/membership/columns";
import { DataTable } from '@/components/admin/membership/data-table';
import EditMembershipModal from '@/components/admin/membership/EditmembershipModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// Breadcrumbs sudah benar menggunakan helper route()
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Keanggotaan',
        href: route('admin.memberships.index'),
    },
];

export type Membership = MembershipRow;

interface Props {
    memberships: Membership[];
}

export default function MembershipsIndex({ memberships }: Props) {
    // Gunakan state untuk data lokal jika Anda ingin update UI instan (optimistic update)
    const [data, setData] = useState<Membership[]>(memberships);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

    // Sinkronisasi data saat props dari server berubah (misal setelah refresh/onSuccess)
    useEffect(() => {
        setData(memberships);
    }, [memberships]);

    const handleUpdate = (updatedMembership: Membership) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === updatedMembership.id ? updatedMembership : item
            )
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Anggota" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Keanggotaan</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola status aktif/nonaktif dan masa berlaku kartu anggota perpustakaan.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Daftarkan Anggota
                    </button>
                </div>

                {/* Ringkasan Status Anggota */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Total Anggota</p>
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-green-600 uppercase">Aktif</p>
                        <p className="text-2xl font-bold text-green-600">
                            {data.filter(m => m.status === 'Aktif').length}
                        </p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-red-600 uppercase">Nonaktif</p>
                        <p className="text-2xl font-bold text-red-600">
                            {data.filter(m => m.status === 'Nonaktif').length}
                        </p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl shadow-sm">
                        <p className="text-xs font-medium text-amber-600 uppercase">Kadaluwarsa</p>
                        <p className="text-2xl font-bold text-amber-600">
                            {data.filter(m => m.expires_at && new Date(m.expires_at) < new Date()).length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-4 overflow-hidden">
                    <DataTable
                        columns={MembershipColumns(setEditModalOpen, setSelectedMembership)}
                        data={data}
                    />
                </div>
            </div>

            {/* Modal Edit diletakkan di luar div utama agar tidak terkena overflow */}
            {selectedMembership && (
                <EditMembershipModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedMembership(null);
                    }}
                    membership={selectedMembership}
                    onUpdate={handleUpdate}
                />
            )}

            <AddMembershipModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </AppLayout>
    );
}