import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Calendar, BookOpen, User } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Pastikan shadcn badge terinstall
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
export type Loan = {
  id: number;
  user_id: number;
  book_id: number;
  user?: { name: string }; // Eager loaded from Laravel
  book?: { title: string }; // Eager loaded from Laravel
  loan_date: string;
  due_date: string;
  return_date: string | null;
  fine_amount: number;
  status: 'active' | 'returned' | 'overdue';
};

/* =====================
    DELETE
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus riwayat peminjaman ini?")) {
    router.delete(`/admin/loans/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedLoan: (loan: Loan) => void
): ColumnDef<Loan>[] => [
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
      accessorKey: "user.name",
      header: "Peminjam",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{row.original.user?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "book.title",
      header: "Judul Buku",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-slate-400" />
          <span className="max-w-[200px] truncate">{row.original.book?.title || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Jatuh Tempo",
      cell: ({ row }) => {
        const date = new Date(row.getValue("due_date"));
        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-3 w-3" />
            {date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        );
      },
    },
    {
      accessorKey: "fine_amount",
      header: "Denda",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("fine_amount"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(amount);

        return <span className={amount > 0 ? "text-red-600 font-medium" : ""}>{formatted}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          active: "default",
          returned: "secondary",
          overdue: "destructive",
        };

        const labelMap: Record<string, string> = {
          active: "Dipinjam",
          returned: "Kembali",
          overdue: "Terlambat",
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
      cell: ({ row }) => {
        const loan = row.original;

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
                  setSelectedLoan(loan);
                  setEditModalOpen(true);
                }}
              >
                Update Status / Denda
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(loan.id)}
              >
                Hapus Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];