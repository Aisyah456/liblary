import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Trash2, Edit, User, GraduationCap } from "lucide-react";
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

// Gunakan interface yang sama dengan Index (atau import jika dipisah)
export type ReferenceService = {
  id: number;
  user_id: number;
  user?: { name: string; email: string };
  subject_area: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  librarian_notes: string | null;
  created_at: string;
};

const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus pengajuan layanan referensi ini?")) {
    router.delete(`/admin/reference-services/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS DEFINITION
===================== */
export const columns = (
  onEdit: (service: ReferenceService) => void // Lebih simpel dilempar satu fungsi saja
): ColumnDef<ReferenceService>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "subject_area",
      header: "Bidang Ilmu / Subjek",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[250px]">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate">
              {row.getValue("subject_area")}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground line-clamp-1 italic">
            {row.original.description}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Pemohon",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3 w-3 text-slate-400" />
          <span>{row.original.user?.name || "Unknown User"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const statusStyles: Record<string, string> = {
          pending: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
          processing: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
          completed: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        };

        return (
          <Badge variant="outline" className={`capitalize font-medium ${statusStyles[status] || ""}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Masuk",
      cell: ({ row }) => {
        const dateStr = row.getValue("created_at") as string;
        if (!dateStr) return "-";

        return (
          <span className="text-sm">
            {new Date(dateStr).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const service = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Aksi Petugas</DropdownMenuLabel>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(service.subject_area)}
              >
                <Copy className="mr-2 h-4 w-4" /> Salin Subjek
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-indigo-600 focus:text-indigo-700 cursor-pointer"
                onClick={() => onEdit(service)}
              >
                <Edit className="mr-2 h-4 w-4" /> Update Status
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 focus:text-red-700 cursor-pointer"
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];