import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { FeedbackRow } from "@/pages/admin/cms/Feedback"; // Pastikan path ini sesuai

export const columns = (onEdit: (row: FeedbackRow) => void): ColumnDef<FeedbackRow>[] => [
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.original.type;
            return (
                <Badge
                    variant={type === "Aduan" ? "destructive" : "outline"}
                    className={type === "Saran" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                >
                    {type}
                </Badge>
            );
        }
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
            <span className="text-sm font-medium text-muted-foreground">
                {row.original.category}
            </span>
        )
    },
    {
        accessorKey: "message",
        header: "Pesan/Aduan",
        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <p className="text-sm truncate font-medium" title={row.original.message}>
                    {row.original.message}
                </p>
            </div>
        )
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-orange-600">{row.original.rating}</span>
                <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            </div>
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
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus data feedback ini?')) {
                                // Ganti 'admin.feedback.destroy' sesuai nama route Laravel Anda
                                router.delete(route('admin.feedback.destroy', item.id), {
                                    preserveScroll: true,
                                });
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Hapus</span>
                    </Button>
                </div>
            );
        }
    }
];