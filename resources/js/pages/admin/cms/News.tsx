import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddNewsModal from '@/components/admin/news/AddNewsModal';
import { columns } from '@/components/admin/news/columns';
import type { NewsRow } from '@/components/admin/news/columns';
import EditNewsModal from '@/components/admin/news/EditNewsModal';
import { DataTable } from '@/components/admin/services/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import NewsRoute from '@/routes/news';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Berita', href: NewsRoute.index.url() },
];

interface NewsPageProps {
    news: NewsRow[];
}

export default function NewsCmsPage({ news }: NewsPageProps) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsRow | null>(null);

    const onEdit = (item: NewsRow) => {
        setSelectedNews(item);
        setEditModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Berita" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Berita</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola berita dan pengumuman yang ditampilkan di halaman publik /news.
                        </p>
                    </div>
                    <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Berita
                    </Button>
                </div>

                <AddNewsModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />

                <div className="rounded-md border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    <DataTable
                        columns={columns(onEdit)}
                        data={news}
                        searchKey="title"
                    />
                </div>
            </div>

            <EditNewsModal
                isOpen={editModalOpen}
                news={selectedNews}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedNews(null);
                }}
            />
        </AppLayout>
    );
}
