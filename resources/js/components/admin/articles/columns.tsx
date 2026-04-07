import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* =====================
    TYPES
===================== */
export type ArticleRow = {
    id: number;
    title: string;
    slug: string;
    category: "Berita Utama" | "Akademik" | "Koleksi" | "Event" | "Layanan";
    excerpt: string;
    content: string;
    thumbnail: string | null;
    reading_time: number;
    is_featured: boolean;
    views: number;
    created_at: string;
};

/* =====================
    DELETE LOGIC
===================== */
const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
        router.delete(`/admin/articles/${id}`, {
            preserveScroll: true,
            onError: () => {
                alert("Gagal menghapus artikel.");
            },
        });
    }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
    onEdit: (article: ArticleRow) => void
): ColumnDef<ArticleRow>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },

        /* ================= THUMBNAIL ================= */
        {
            accessorKey: "thumbnail",
            header: "Thumbnail",
            cell: ({ row }) => {
                const img = row.original.thumbnail;

                return (
                    <div className="h-12 w-16 overflow-hidden rounded border bg-slate-50 flex items-center justify-center">
                        {img ? (
                            <img
                                src={`/storage/${img}`}
                                alt="thumbnail"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="h-4 w-4 text-slate-400" />
                        )}
                    </div>
                );
            },
        },

        /* ================= TITLE ================= */
        {
            accessorKey: "title",
            header: "Judul Artikel",
            cell: ({ row }) => (
                <div className="flex flex-col max-w-[250px]">
                    <span className="font-semibold text-sm line-clamp-1">
                        {row.original.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {row.original.excerpt}
                    </span>
                </div>
            ),
        },

        /* ================= CATEGORY ================= */
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => {
                const category = row.original.category;

                return (
                    <Badge variant="outline" className="text-xs">
                        {category}
                    </Badge>
                );
            },
        },

        /* ================= READING TIME ================= */
        {
            accessorKey: "reading_time",
            header: "Durasi",
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">
                    {row.original.reading_time} min
                </span>
            ),
        },

        /* ================= VIEWS ================= */
        {
            accessorKey: "views",
            header: "Views",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.views}
                </Badge>
            ),
        },

        /* ================= FEATURED ================= */
        {
            accessorKey: "is_featured",
            header: "Highlight",
            filterFn: "equals",
            cell: ({ row }) => {
                const featured = row.original.is_featured;

                return (
                    <Badge
                        className={
                            featured
                                ? "bg-amber-500 text-white"
                                : "bg-slate-400 text-white"
                        }
                    >
                        {featured ? "Featured" : "Normal"}
                    </Badge>
                );
            },
        },

        /* ================= LINK ================= */
        {
            id: "link",
            header: "Preview",
            cell: ({ row }) => (
                <a
                    href={`/articles/${row.original.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                    <ExternalLink className="h-3 w-3" />
                    Lihat
                </a>
            ),
        },

        /* ================= ACTION ================= */
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const article = row.original;

                return (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(article)}
                        >
                            <Edit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                );
            },
        },
    ];