import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react'; 
import { useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/articles/data-table';
import { columns, type ArticleRow } from '@/components/admin/articles/columns';
import AddArticleModal from '@/components/admin/articles/AddArticleModal';
import EditArticleModal from '@/components/admin/articles/EditArticleModal';

interface ArticleCmsPageProps {
    articles: ArticleRow[];
}

export default function ArticleCmsPage({ articles }: ArticleCmsPageProps) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<ArticleRow | null>(null);

    // Menggunakan useCallback agar fungsi tidak dibuat ulang setiap render (opsional tapi baik untuk performa DataTable)
    const handleEdit = useCallback((item: ArticleRow) => {
        setSelectedArticle(item);
        setEditModalOpen(true);
    }, []);

    const handleCloseEdit = () => {
        setEditModalOpen(false);
        // Memberikan sedikit jeda agar transisi modal tertutup selesai sebelum data dihapus
        setTimeout(() => setSelectedArticle(null), 200);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Artikel', href: '/admin/cms/articles' }]}>
            <Head title="Manajemen Artikel" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Manajemen Artikel & Berita
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola berita, event, layanan, dan konten perpustakaan.
                        </p>
                    </div>

                    <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Artikel
                    </Button>
                </div>

                <div className="rounded-md border bg-white dark:bg-zinc-950 p-4 shadow-sm">
                    {/* Pastikan columns menerima fungsi handleEdit dengan benar */}
                    <DataTable
                        columns={columns(handleEdit)}
                        data={articles}
                        searchKey="title"
                    />
                </div>
            </div>

            {/* Modal Tambah */}
            <AddArticleModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />

            {/* Modal Edit - Render kondisional tetap dipertahankan agar form reset saat ganti artikel */}
            {selectedArticle && (
                <EditArticleModal
                    isOpen={editModalOpen}
                    article={{
                        ...selectedArticle,
                        thumbnail: selectedArticle.thumbnail ?? undefined,
                    }}
                    onClose={handleCloseEdit}
                />
            )}
        </AppLayout>
    );
}