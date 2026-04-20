// @ts-nocheck
import { Head } from '@inertiajs/react';
import { Plus, Handshake } from 'lucide-react'; // Mengganti ikon
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/partners/data-table'; // Pastikan path folder diubah
import { columns } from '@/components/admin/partners/columns'; // Pastikan path folder diubah
import AddPartnerModal from '@/components/admin/partners/AddPartnerModal';
import EditPartnerModal from '@/components/admin/partners/EditPartnerModal';

// 1. Sesuaikan Interface dengan skema DB partners
export interface PartnerRow {
    id: number;
    name: string;
    logo: string | null;
    type: 'supplier' | 'mitra' | 'donator';
    email?: string;
    phone?: string;
    address?: string;
    contact_person?: string;
    mou_number?: string;
    partnership_expiry?: string;
    is_active: boolean;
    created_at?: string;
}

export default function PartnerCmsPage({ partners }: { partners: PartnerRow[] }) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<PartnerRow | null>(null);

    // Fungsi untuk memicu modal edit
    const onEdit = (item: PartnerRow) => {
        setSelectedPartner(item);
        setEditModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Partner', href: '#' }]}>
            <Head title="Manajemen Partner" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Partner & Kerjasama</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data supplier buku, mitra instansi, dan donatur perpustakaan.
                        </p>
                    </div>
                    <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Partner
                    </Button>
                </div>

                <div className="rounded-md border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    <DataTable
                        columns={columns(onEdit)}
                        data={partners}
                        searchKey="name" // Pencarian berdasarkan nama partner
                    />
                </div>
            </div>

            {/* Modal Tambah Partner */}
            <AddPartnerModal 
                isOpen={addModalOpen} 
                onClose={() => setAddModalOpen(false)} 
            />

            {/* Modal Edit Partner */}
            {selectedPartner && (
                <EditPartnerModal
                    isOpen={editModalOpen}
                    partner={selectedPartner}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedPartner(null);
                    }}
                />
            )}
        </AppLayout>
    );
}