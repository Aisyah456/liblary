import { ColumnDef } from "@tanstack/react-table";
import { BookProposalRow } from '@/pages/admin/PublicBook/BookProposalCmsPage';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, MoreHorizontal, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns = (onEdit: (row: BookProposalRow) => void): ColumnDef<BookProposalRow>[] => [
    {
        accessorKey: "title",
        header: "Judul Buku",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.original.title}</span>
                <span className="text-xs text-slate-500">{row.original.author || 'Penulis tidak diketahui'}</span>
            </div>
        )
    },
    {
        accessorKey: "full_name",
        header: "Pengusul",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.full_name}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                    {row.original.requester_type}
                </span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const variants: Record<string, string> = {
                pending: "bg-amber-100 text-amber-700 border-amber-200",
                approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
                rejected: "bg-rose-100 text-rose-700 border-rose-200",
                ordered: "bg-blue-100 text-blue-700 border-blue-200",
                available: "bg-teal-600 text-white border-teal-700",
            };
            return (
                <Badge variant="outline" className={`${variants[status]} capitalize shadow-sm`}>
                    {status}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit / Review
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];