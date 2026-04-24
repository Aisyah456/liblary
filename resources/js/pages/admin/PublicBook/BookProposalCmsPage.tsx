import { Head } from '@inertiajs/react';
import { Plus, BookOpen, GraduationCap, Globe } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/services/data-table';
import { columns } from '@/components/admin/proposals/columns';
import AddProposalForm from '@/components/admin/proposals/AddProposalModal';
import EditProposalForm from '@/components/admin/proposals/EditProposalModal';


export interface BookProposalRow {
    id: number;
    full_name: string;
    identifier_id: string | null;
    email: string;
    phone_number: string | null;
    requester_type: 'mahasiswa' | 'dosen' | 'staf' | 'umum' | 'tamu';
    institution: string | null;
    title: string;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    publish_year: number | null;
    reason: string;
    reference_link: string | null;
    status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'ordered' | 'available';
    admin_note: string | null;
    created_at: string;
}

export default function BookProposalCmsPage({ proposals }: { proposals: BookProposalRow[] }) {
    // Gunakan satu state 'view' untuk mengatur tampilan halaman
    const [view, setView] = useState<'table' | 'add' | 'edit'>('table');
    const [selected, setSelected] = useState<BookProposalRow | null>(null);

    // Fungsi saat tombol edit di tabel diklik
    const onEdit = (item: BookProposalRow) => {
        setSelected(item);
        setView('edit');
    };

    // Render Form Tambah
    if (view === 'add') {
        return (
            <AppLayout breadcrumbs={[{ title: 'Tambah Usulan', href: '#' }]}>
                <div className="p-4">
                    <AddProposalForm onBack={() => setView('table')} />
                </div>
            </AppLayout>
        );
    }

    // Render Form Edit
    if (view === 'edit' && selected) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Edit Usulan', href: '#' }]}>
                <div className="p-4">
                    <EditProposalForm proposal={selected} onBack={() => setView('table')} />
                </div>
            </AppLayout>
        );
    }

    // Render Tabel Utama
    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Usulan Buku', href: '#' }]}>
            <Head title="Usulan Buku" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Usulan Buku</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pengadaan koleksi baru berdasarkan usulan mahasiswa, dosen, dan pengunjung.
                        </p>
                    </div>

                    <Button onClick={() => setView('add')} className="gap-2 bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4" />
                        Tambah Usulan Manual
                    </Button>
                </div>

                {/* Ringkasan Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm flex items-center gap-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Pending</p>
                            <p className="text-xl font-bold">{proposals.filter(p => p.status === 'pending').length}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm flex items-center gap-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Total Usulan</p>
                            <p className="text-xl font-bold">{proposals.length}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm flex items-center gap-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Tersedia</p>
                            <p className="text-xl font-bold">{proposals.filter(p => p.status === 'available').length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    <DataTable
                        columns={columns(onEdit)}
                        data={proposals}
                        searchKey="title"
                    />
                </div>
            </div>
        </AppLayout>
    );
}