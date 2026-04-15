import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, ExternalLink, Image as ImageIcon, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            onSuccess: () => {
            // Tambahkan toast notification di sini jika ada
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
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        /* ================= THUMBNAIL ================= */
        {
            id: "thumbnail", // ID Eksplisit agar tidak ada warning di console
            header: "Thumbnail",
            cell: ({ row }) => {
                const img = row.original.thumbnail;

                // Fungsi Helper yang sangat ketat
                const getImageUrl = (path: string | null | undefined) => {
                    if (!path) return null;

                    // Jika path adalah URL lengkap (dimulai dengan http), JANGAN tambah /storage/
                    if (path.includes('http://') || path.includes('https://')) {
                        // Kadang data kotor: "http://127.0.0.1:8000/storage/https://picsum..."
                        // Kita ambil bagian setelah https:// terakhir
                        const parts = path.split('https://');
                        if (parts.length > 2) return 'https://' + parts[parts.length - 1];
                        return path;
                    }

                    // Jika path lokal, pastikan tidak ada double slash
                    const cleanPath = path.replace(/^\//, '');
                    return `/storage/${cleanPath}`;
                };

                const finalUrl = getImageUrl(img);

                return (
                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                        {finalUrl ? (
                            <img
                                src={finalUrl}
                                alt="thumb"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placehold.co/400x300?text=Error+Load";
                                }}
                            />
                        ) : (
                                <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                        )}
                    </div>
                );
            },
        },

        /* ================= TITLE ================= */
        {
            accessorKey: "title", // Pastikan ini sama dengan key di ArticleRow
            id: "title",          // Tambahkan ini untuk menghilangkan warning "Column with id 'title' does not exist"
            header: "Judul Artikel",
            cell: ({ row }) => (
                <div className="flex flex-col max-w-[250px]">
                    <span className="font-semibold text-sm line-clamp-1">
                        {row.original.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {row.original.excerpt || "Tidak ada ringkasan."}
                    </span>
                </div>
            ),
        },

        /* ================= VIEWS (Fix Crash) ================= */
        {
            id: "views",
            header: "Views",
            cell: ({ row }) => {
                const views = row.original.views ?? 0; // Mengatasi error toLocaleString
                return (
                    <Badge variant="secondary">
                        {views.toLocaleString('id-ID')}
                    </Badge>
                );
            }
        },

        /* ================= CATEGORY ================= */
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal capitalize whitespace-nowrap">
                    {row.getValue("category")}
                </Badge>
            ),
        },

        /* ================= STATS (Views & Reading Time) ================= */
        {
            id: "stats",
            header: "Statistik",
            cell: ({ row }) => {
                // Berikan nilai default 0 jika views undefined/null
                const views = row.original.views ?? 0;
                const readingTime = row.original.reading_time ?? 0;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{views.toLocaleString('id-ID')} kali</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{readingTime} mnt</span>
                        </div>
                    </div>
                );
            },
        },

        /* ================= FEATURED ================= */
        {
            accessorKey: "is_featured",
            header: "Status",
            cell: ({ row }) => {
                const isFeatured = row.original.is_featured;
                return (
                    <Badge
                        variant={isFeatured ? "default" : "secondary"}
                        className={isFeatured ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" : "opacity-60"}
                    >
                        {isFeatured ? "Featured" : "Standard"}
                    </Badge>
                );
            },
        },

        /* ================= DATE ================= */
        {
            accessorKey: "created_at",
            header: "Tanggal Terbit",
            cell: ({ row }) => {
                const dateStr = row.original.created_at;

                // Cek apakah tanggal valid
                if (!dateStr) return <span className="text-xs text-muted-foreground">-</span>;

                const date = new Date(dateStr);

                return (
                    <div className="text-xs">
                        <div className="font-medium text-slate-700">
                            {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-muted-foreground italic">
                            {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                );
            },
        },

        /* ================= ACTION ================= */
        {
            id: "actions",
            header: () => <div className="text-right px-4">Aksi</div>,
            cell: ({ row }) => {
                const article = row.original;

                return (
                    <div className="flex items-center justify-end gap-1 px-2">
                        <TooltipProvider delayDuration={300}>
                            {/* Preview Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                                        <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Lihat Artikel</TooltipContent>
                            </Tooltip>

                            {/* Edit Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100" onClick={() => onEdit(article)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(article.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Hapus</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
        },
    ];