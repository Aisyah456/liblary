import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Pastikan Anda punya komponen Badge shadcn
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

/* =====================
    TYPE
===================== */
export type LibraryClearance = {
  id: number;
  user_id: number;
  user?: { name: string; email: string }; // Eager loaded dari Laravel
  certificate_number: string | null;
  has_returned_all_books: boolean;
  has_paid_fines: boolean;
  status: 'request' | 'verified' | 'rejected';
  created_at: string;
};

/* =====================
    DELETE
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus data pengajuan ini?")) {
    router.delete(`/admin/library-clearances/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedClearance: (clearance: LibraryClearance) => void
): ColumnDef<LibraryClearance>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "user.name",
      header: "Nama Mahasiswa",
      cell: ({ row }) => row.original.user?.name || "N/A",
    },
    {
      accessorKey: "certificate_number",
      header: "No. Sertifikat",
      cell: ({ row }) => row.getValue("certificate_number") || "-",
    },
    {
      accessorKey: "has_returned_all_books",
      header: "Buku Kembali",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.has_returned_all_books ? (
            <Badge variant="outline" className="text-green-600 border-green-600">Sudah</Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-600">Belum</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "has_paid_fines",
      header: "Bebas Denda",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.has_paid_fines ? (
            <Badge variant="outline" className="text-green-600 border-green-600">Lunas</Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-600">Ada Tunggakan</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        switch (status) {
          case 'verified':
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi</Badge>;
          case 'rejected':
            return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
          default:
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const clearance = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi Verifikasi</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-indigo-600 font-medium"
                onClick={() => {
                  setSelectedClearance(clearance);
                  setEditModalOpen(true);
                }}
              >
                Proses / Update
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(clearance.id)}
              >
                Hapus Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];