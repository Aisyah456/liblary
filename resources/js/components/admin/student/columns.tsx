import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* =====================
    TYPES
===================== */
export type Student = {
  id: number;
  user_id: number;
  nim: string;
  program_studi: string; // Menyimpan nama Major dari db
  fakultas: string;      // Menyimpan nama Faculty dari db
  angkatan: number;
  no_telp?: string;
  alamat?: string;
  max_pinjam: number;
  status: 'Aktif' | 'Nonaktif' | 'Lulus' | 'Cuti';
  user?: {
    name: string;
    email: string;
  };
};

/* =====================
    DELETE LOGIC
===================== */
const handleDelete = (id: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
    router.delete(`/admin/student/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // Berhasil dihapus, Inertia otomatis refresh data
      },
      onError: (errors) => {
        console.error(errors);
        alert("Gagal menghapus data.");
      }
    });
  }
};

/* =====================
    COLUMNS DEFINITION
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedStudent: (student: Student) => void
): ColumnDef<Student>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>
    },
    {
      accessorKey: "nim",
      header: "NIM",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.nim}</span>
    },
    {
      id: "name",
      header: "Nama Mahasiswa",
      accessorFn: (row) => row.user?.name || "-",
    },
    {
      accessorKey: "program_studi",
      header: "Prodi",
      // Kita bisa menambahkan badge kecil untuk prodi agar lebih manis
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.program_studi}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{row.original.fakultas}</span>
        </div>
      )
    },
    {
      accessorKey: "angkatan",
      header: "Angkatan",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          Aktif: "default",
          Nonaktif: "destructive",
          Lulus: "outline",
          Cuti: "secondary",
        };
        return <Badge variant={variantMap[status] || "outline"}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-900"
              onClick={() => {
                navigator.clipboard.writeText(student.nim);
                // Opsi: Tambahkan toast notification di sini
              }}
              title="Salin NIM"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSelectedStudent(student);
                setEditModalOpen(true);
              }}
              title="Update"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(student.id)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];