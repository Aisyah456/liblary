import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User, Download, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 1. Tipe Data
export type Ebook = {
    id: number;
    category_id: number;
    title: string;
    author: string;
    file_path: string;
    format: string;
    category?: {
        name: string;
    };
};

// 2. Fungsi Helper (Internal)
const handleDelete = (id: number) => {
    if (confirm("Hapus E-Book ini? File yang tersimpan juga akan dihapus.")) {
        router.delete(`/admin/ebooks/${id}`, {
            preserveScroll: true,
        });
    }
};

// 3. Export Columns
// PENTING: Hapus import { columns as EbookColumns } yang tadi ada di sini!
export const columns = (
    setEditModalOpen: (open: boolean) => void,
    setSelectedEbook: (ebook: Ebook) => void
): ColumnDef<Ebook>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: "Informasi E-Book",
            cell: ({ row }) => {
                const ebook = row.original;
                return (
                    <div className="flex flex-col max-w-[250px]">
                        <span className="font-semibold truncate text-sm">{ebook.title}</span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                            {/* <span className="flex items-center gap-1">
                                <FolderLibrary className="w-3 h-3" /> {ebook.category?.name || "Tanpa Kategori"}
                            </span> */}
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "author",
            header: "Penulis",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate">{row.original.author}</span>
                </div>
            )
        },
        {
            accessorKey: "format",
            header: "Berkas",
            cell: ({ row }) => {
                const format = row.original.format?.toLowerCase() || "file";
                const fileName = row.original.file_path.split('/').pop();

                return (
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className={`text-[10px] uppercase px-2 py-0 h-5 text-white border-none ${format === 'pdf' ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                        >
                            {format}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[120px]" title={fileName}>
                            {fileName}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const ebook = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedEbook(ebook);
                                    setEditModalOpen(true);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4 text-amber-500" />
                                Edit Data
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => window.open(`/storage/${ebook.file_path}`, '_blank')}
                            >
                                <Download className="mr-2 h-4 w-4 text-blue-500" />
                                Lihat / Unduh
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                onClick={() => handleDelete(ebook.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus E-Book
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];