import { Head } from '@inertiajs/react';
import { Plus, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/services/data-table';
import { columns } from '@/components/admin/feedback/columns'; 
import AddFeedbackModal from '@/components/admin/feedback/AddFeedbackModal'; 
import EditFeedbackModal from '@/components/admin/feedback/EditFeedbackModal'; 

// 1. Sesuaikan Interface dengan Schema DB
export interface FeedbackRow {
    id: number;
    category: string; // Koleksi Buku, Layanan Digital, dll
    rating: number;   // 1-5
    message: string;  // Isi aduan/pesan
    type: string;     // Saran/Aduan
    created_at?: string;
}

export default function FeedbackCmsPage({ feedbacks }: { feedbacks: FeedbackRow[] }) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null);

    const onEdit = (item: FeedbackRow) => {
        setSelectedFeedback(item);
        setEditModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Feedback Perpustakaan', href: '#' }]}>
            <Head title="Manajemen Feedback" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Feedback & Saran</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola masukan, saran, dan aduan dari pengunjung perpustakaan.
                        </p>
                    </div>
                    {/* Opsional: Jika feedback diisi oleh admin, tombol ini tetap ada. 
                        Jika feedback hanya untuk melihat data masuk, tombol ini bisa dihapus */}
                    <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Feedback Manual
                    </Button>
                </div>

                <div className="rounded-md border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    <DataTable
                        columns={columns(onEdit)}
                        data={feedbacks}
                        searchKey="message" // Mencari berdasarkan isi pesan
                    />
                </div>
            </div>

            {/* Modal Tambah */}
            <AddFeedbackModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />

            {/* Modal Edit */}
            {selectedFeedback && (
                <EditFeedbackModal
                    isOpen={editModalOpen}
                    feedback={selectedFeedback}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedFeedback(null);
                    }}
                />
            )}
        </AppLayout>
    );
}