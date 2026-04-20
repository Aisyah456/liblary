import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

// Definisi Tipe berdasarkan Schema Database
export type Borrowing = {
  id: number;
  member_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'dipinjam' | 'kembali' | 'terlambat';
  notes: string | null;

  // Relasi (Pastikan di Controller Laravel menggunakan ->with(['member', 'book']))
  member?: {
    library_card_number: string;
    memberable: {
      nama_lengkap?: string;
      user?: { name: string };
    }
  };
  book?: {
    title: string;
    isbn: string;
  };
};

const handleDelete = (id: number) => {
  if (confirm("Hapus data peminjaman ini? Tindakan ini tidak dapat dibatalkan.")) {
    router.delete(`/admin/borrowings/${id}`, {
      preserveScroll: true,
    });
  }
};

export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedBorrowing: (borrowing: Borrowing) => void
): ColumnDef<Borrowing>[] => [
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
      id: "book_info",
      header: "Buku",
      cell: ({ row }) => {
        const book = row.original.book;
        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-medium truncate">{book?.title || "Buku Dihapus"}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{book?.isbn}</span>
          </div>
        );
      }
    },
    {
      id: "member_info",
      header: "Peminjam",
      cell: ({ row }) => {
        const member = row.original.member;
        const name = member?.memberable.nama_lengkap || member?.memberable.user?.name || "N/A";
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{member?.library_card_number}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "borrow_date",
      header: "Tgl Pinjam",
      cell: ({ row }) => new Date(row.original.borrow_date).toLocaleDateString('id-ID'),
    },
    {
      accessorKey: "due_date",
      header: "Tenggat",
      cell: ({ row }) => {
        const date = row.original.due_date;
        const isOverdue = row.original.status === 'dipinjam' && new Date(date) < new Date();

        return (
          <div className="flex flex-col">
            <span className={isOverdue ? "text-red-600 font-bold" : ""}>
              {new Date(date).toLocaleDateString('id-ID')}
            </span>
            {isOverdue && <span className="text-[9px] text-red-500 font-bold italic underline">TERLAMBAT</span>}
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = {
          dipinjam: { label: "Dipinjam", variant: "outline" as const, icon: Clock },
          kembali: { label: "Kembali", variant: "default" as const, icon: CheckCircle2 },
          terlambat: { label: "Terlambat", variant: "destructive" as const, icon: AlertCircle },
        };

        const { label, variant, icon: Icon } = config[status];

        return (
          <Badge variant={variant} className="flex w-fit items-center gap-1">
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const borrowing = row.original;

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
                onClick={() => {
                  setSelectedBorrowing(borrowing);
                  setEditModalOpen(true);
                }}
              >
                Update Status / Tanggal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(borrowing.id)}
              >
                Hapus Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];