import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Trash2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* =====================
    TYPES
===================== */
export type BookSuggestion = {
  id: number;
  user_id: number;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  publication_year?: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
};

/* =====================
    DELETE LOGIC
===================== */
const handleDelete = (id: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus usulan buku ini?")) {
    router.delete(`/book-suggestions/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // Berhasil dihapus
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
  setSelectedSuggestion: (suggestion: BookSuggestion) => void
): ColumnDef<BookSuggestion>[] => [
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
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>
    },
    {
      accessorKey: "title",
      header: "Judul Buku",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[200px]">
          <span className="font-medium truncate" title={row.original.title}>
            {row.original.title}
          </span>
          <span className="text-xs text-muted-foreground italic">Oleh: {row.original.author}</span>
        </div>
      )
    },
    {
      id: "suggested_by",
      header: "Pengusul",
      accessorFn: (row) => row.user?.name || "Anonim",
    },
    {
      accessorKey: "isbn",
      header: "ISBN",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.isbn || "-"}</span>
    },
    {
      accessorKey: "publication_year",
      header: "Tahun",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          approved: "default",   // Hijau/Biru (Tergantung tema Shadcn)
          pending: "secondary",  // Abu-abu
          rejected: "destructive", // Merah
        };

        // Label untuk tampilan lebih rapi
        const labelMap: Record<string, string> = {
          approved: "Disetujui",
          pending: "Menunggu",
          rejected: "Ditolak"
        };

        return (
          <Badge variant={variantMap[status] || "outline"} className="capitalize">
            {labelMap[status] || status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const suggestion = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => {
                if (suggestion.isbn) navigator.clipboard.writeText(suggestion.isbn);
              }}
              title="Salin ISBN"
              disabled={!suggestion.isbn}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSelectedSuggestion(suggestion);
                setEditModalOpen(true);
              }}
              title="Edit / Respon Admin"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(suggestion.id)}
              title="Hapus Usulan"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];