import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { HeroRow } from "@/pages/admin/cms/Hero";

export const columns = (onEdit: (row: HeroRow) => void): ColumnDef<HeroRow>[] => [
    {
        accessorKey: "image_path",
        header: "Preview",
        cell: ({ row }) => {
            const imagePath = row.original.image_path;
            // Cek apakah imagePath adalah URL lengkap atau path lokal storage
            let imageUrl = "";

            if (!imagePath) {
                imageUrl = "https://placehold.co/600x400?text=No+Image";
            } else if (imagePath.startsWith('http')) {
                // Jika sudah URL lengkap (misal dari S3 atau CDN)
                imageUrl = imagePath;
            } else {
                // Pastikan tidak ada double slash dan diarahkan ke path public storage
                // Gunakan replace untuk membersihkan jika di DB tersimpan '/storage/abc.jpg'
                const cleanPath = imagePath.replace(/^\//, '');
                imageUrl = `/storage/${cleanPath}`;
            }

            return (
                <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                    <img
                        src={imageUrl}
                        className="h-full w-full object-cover"
                        alt="banner preview"
                        // Handle error jika file fisik tidak ada di server
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== "https://placehold.co/600x400?text=Not+Found") {
                                target.src = "https://placehold.co/600x400?text=Not+Found";
                            }
                        }}
                    />
                </div>
            );
        }
    },
    {
        accessorKey: "title_line_1",
        header: "Judul & Highlight",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-sm line-clamp-1">
                    {row.original.title_line_1}
                </span>
                <span className="text-xs text-blue-600 font-bold italic line-clamp-1">
                    {row.original.title_highlight}
                </span>
            </div>
        )
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={row.original.is_active ? "default" : "secondary"}
                className={row.original.is_active ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            >
                {row.original.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
        )
    },
    {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(item)}
                    >
                        <Edit className="h-4 w-4 text-orange-500" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
                                router.delete(route('Hero.destroy', item.id), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        console.log('Deleted');
                                    },
                                    onError: () => {
                                        alert('Gagal hapus');
                                    }
                                });
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            );
        }
    }
];