import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type NewsRow = {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    category: string | null;
    excerpt: string | null;
    body: string;
    published_at: string | null;
    is_published: boolean;
    is_featured: boolean;
};

const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        router.delete(route('admin.news.destroy', id), {
            preserveScroll: true,
        });
    }
};

export const columns = (onEdit: (news: NewsRow) => void): ColumnDef<NewsRow>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "thumbnail",
        header: "Gambar",
        cell: ({ row }) => {
            const thumbnail = row.getValue("thumbnail") as string;
            return (
                <div className="flex items-center justify-center">
                    {thumbnail ? (
                        <img
                            src={`/storage/${thumbnail}`}
                            alt="Thumbnail"
                            className="h-12 w-20 object-cover rounded-md border shadow-sm"
                            // Error handling jika gambar tidak ditemukan
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=No+Image';
                            }}
                        />
                    ) : (
                        <div className="h-12 w-20 bg-muted flex items-center justify-center rounded-md text-[10px] text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'title',
        header: 'Judul',
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[280px]">
                <span className="font-semibold text-sm text-slate-900 line-clamp-2">
                    {row.original.title}
                </span>
                {row.original.category && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                        {row.original.category}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'published_at',
        header: 'Terbit',
        cell: ({ row }) => {
            const date = row.original.published_at;
            if (!date) return <span className="text-slate-400">—</span>;
            return (
                <span className="text-sm text-slate-600">
                    {new Date(date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_published',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                className={
                    row.original.is_published
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-slate-400 text-white'
                }
            >
                {row.original.is_published ? 'Publik' : 'Draft'}
            </Badge>
        ),
    },
    {
        accessorKey: 'is_featured',
        header: 'Unggulan',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.is_featured ? 'Ya' : 'Tidak'}
            </Badge>
        ),
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const news = row.original;
            return (
                <div className="flex items-center gap-1">
                    <a
                        href={`/news/${news.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                        onClick={() => onEdit(news)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(news.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
