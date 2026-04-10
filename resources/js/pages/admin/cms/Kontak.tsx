import { Head } from '@inertiajs/react';
import { Mail, Clock } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
// HAPUS: import { route } from 'ziggy-js';
// Biarkan global 'route' yang bekerja atau gunakan window.route jika di TypeScript

import { columns } from '@/components/admin/messages/columns';
import { DataTable } from '@/components/admin/messages/data-table';
import ReplyMessageModal from '@/components/admin/messages/ReplyMessageModal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export interface Message {
    id: number;
    nama_lengkap: string;
    nim_nidn: string | null;
    email: string;
    subjek: string;
    pesan: string;
    balasan_admin: string | null;
    status: 'pending' | 'selesai';
    tgl_dibalas: string | null;
    created_at: string;
    updated_at: string;
}

interface MessagesProps {
    messages: Message[];
}

export default function MessagesIndex({ messages }: MessagesProps) {
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    /* ================= HANDLERS ================= */
    const handleReply = useCallback((message: Message) => {
        setSelectedMessage(message);
        setIsReplyModalOpen(true);
    }, []);

    const closeReplyModal = () => {
        setIsReplyModalOpen(false);
        // Reset message setelah animasi modal selesai (biasanya 200-300ms)
        setTimeout(() => setSelectedMessage(null), 300);
    };

    /* ================= COMPUTED ================= */
    // Gunakan useMemo agar tidak dihitung ulang setiap render kecil
    const pendingCount = useMemo(() =>
        messages.filter(m => m.status === 'pending').length
        , [messages]);

    // Definisikan breadcrumbs di dalam komponen agar 'route' tersedia secara global
    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Dashboard',
            href: typeof route !== 'undefined' ? route('admin.dashboard') : '/admin'
        },
        {
            label: 'Pesan Kontak',
            href: '#'
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pesan" />

            <div className="flex flex-col gap-6 p-6">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Mail className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Pesan Masuk
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Kelola saran, masukan, dan pertanyaan dari mahasiswa atau dosen.
                        </p>
                    </div>

                    {pendingCount > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <Clock size={16} className="animate-pulse" />
                            {pendingCount} Perlu Dibalas
                        </div>
                    )}
                </div>

                {/* TABLE SECTION */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns(handleReply)}
                        data={messages}
                        searchKey="nama_lengkap"
                    />
                </div>
            </div>

            {/* MODAL SECTION */}
            <ReplyMessageModal
                isOpen={isReplyModalOpen}
                message={selectedMessage}
                onClose={closeReplyModal}
            />
        </AppLayout>
    );
}