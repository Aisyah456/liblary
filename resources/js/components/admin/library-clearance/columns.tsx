import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
export type Lecturer = {
  id: number;
  nidn: string;
  nama_lengkap: string;
  email: string;
  jenis_kelamin: 'L' | 'P';
  program_studi: string;
  jabatan_fungsional: string | null;
  alamat?: string | null;
  telepon?: string | null;
};

/* =====================
   DELETE
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus dosen ini?")) {
    router.delete(`/lecturers/${id}`, { // Sesuaikan endpoint route Laravel-mu
      preserveScroll: true,
    });
  }
};

/* =====================
   COLUMNS (FUNCTION ✅)
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedLecturer: (lecturer: Lecturer) => void
): ColumnDef<Lecturer>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "nidn",
      header: "NIDN",
    },
    {
      accessorKey: "nama_lengkap",
      header: "Nama Lengkap",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "program_studi",
      header: "Program Studi",
    },
    {
      accessorKey: "jabatan_fungsional",
      header: "Jabatan",
      cell: ({ row }) => row.getValue("jabatan_fungsional") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lecturer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(lecturer.nidn)}
              >
                Salin NIDN
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-blue-600"
                onClick={() => {
                  setSelectedLecturer(lecturer);
                  setEditModalOpen(true);
                }}
              >
                Update
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(lecturer.id)}
              >
                Hapus Dosen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];