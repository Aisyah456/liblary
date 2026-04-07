import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, MapPin, Hash, Info } from "lucide-react";
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
export type Shelf = {
  id: number;
  code: string;
  name: string;
  location: string;
  scientific_works_count?: number; // Diambil dari withCount di Controller
};

const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus rak ini? Rak hanya bisa dihapus jika kosong.")) {
    router.delete(`/shelves/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedShelf: (shelf: Shelf) => void
): ColumnDef<Shelf>[] => [
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
      accessorKey: "code",
      header: "Kode Rak",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono font-bold text-indigo-600">
          <Hash className="h-3 w-3" />
          {row.getValue("code")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Rak",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "location",
      header: "Lokasi Detail",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "scientific_works_count",
      header: "Total Koleksi",
      cell: ({ row }) => (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.scientific_works_count || 0} Item
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const shelf = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi Rak</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(shelf.code)}
              >
                Salin Kode Rak
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-blue-600"
                onClick={() => {
                  setSelectedShelf(shelf);
                  setEditModalOpen(true);
                }}
              >
                Edit Data Rak
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(shelf.id)}
              >
                Hapus Rak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];