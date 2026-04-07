import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, User, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Student = {
  id: number
  nim: string
  name?: string // Tambahkan ini jika nama ada di level root
  program_studi: string
  fakultas: string
  angkatan: number
  user?: {
    name: string
    email: string
  }
}

// Ubah columns menjadi fungsi agar bisa menerima state setter dari parent
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedStudent: (student: Student) => void
): ColumnDef<Student>[] => [
    {
      accessorKey: "nim",
      header: "NIM",
    },
    {
      // Mengambil nama dari relasi user atau root name
      accessorFn: (row) => row.user?.name || row.name || "N/A",
      id: "name",
      header: "Nama Mahasiswa",
    },
    {
      accessorKey: "program_studi",
      header: "Program Studi",
    },
    {
      accessorKey: "fakultas",
      header: "Fakultas",
    },
    {
      accessorKey: "angkatan",
      header: "Angkatan",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(student.nim)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Salin NIM
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* FUNGSI EDIT DI SINI */}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStudent(student);
                  setEditModalOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Mahasiswa
              </DropdownMenuItem>

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Lihat Profil
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <Trash className="mr-2 h-4 w-4" />
                Hapus Mahasiswa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]