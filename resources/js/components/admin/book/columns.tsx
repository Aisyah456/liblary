import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Book as BookIcon, Library, User, Hash, Info } from "lucide-react";
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

// Tipe data disesuaikan 100% dengan Migration Table Books
export type Book = {
  id: number;
  title: string;
  isbn: string | null;
  author: string;
  publisher: string | null;
  publication_year: number | null;
  genre: string | null;
  category: string | null;
  description: string | null;
  total_stock: number;
  available_stock: number;
  created_at?: string;
};

const handleDelete = (id: number) => {
  if (confirm("Hapus buku ini dari katalog? Tindakan ini tidak dapat dibatalkan.")) {
    router.delete(`/admin/books/${id}`, {
      preserveScroll: true,
    });
  }
};

export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedBook: (book: Book) => void
): ColumnDef<Book>[] => [
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
      accessorKey: "title",
      header: "Informasi Buku",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex flex-col max-w-[250px]">
            <span className="font-bold truncate text-sm">{book.title}</span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Hash className="w-3 h-3" /> {book.isbn || "-"}</span>
              <span className="flex items-center gap-0.5"><Library className="w-3 h-3" /> {book.category || "General"}</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "author",
      header: "Penulis & Penerbit",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="flex items-center gap-1"><User className="w-3 h-3 text-muted-foreground" /> {row.original.author}</span>
          <span className="text-[11px] text-muted-foreground">{row.original.publisher} ({row.original.publication_year})</span>
        </div>
      )
    },
    {
      id: "stock",
      header: "Stok (Tersedia/Total)",
      cell: ({ row }) => {
        const total = row.original.total_stock;
        const available = row.original.available_stock;
        const isLow = available <= 2;
        const isEmpty = available === 0;

        return (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${isEmpty ? 'text-red-600' : isLow ? 'text-orange-500' : 'text-green-600'}`}>
                {available}
              </span>
              <span className="text-muted-foreground text-xs">/ {total}</span>
            </div>
            {isEmpty ? (
              <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">Habis</Badge>
            ) : isLow ? (
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 text-orange-500 border-orange-500">Menipis</Badge>
            ) : null}
          </div>
        );
      }
    },
    {
      accessorKey: "genre",
      header: "Genre",
      cell: ({ row }) => row.getValue("genre") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const book = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opsi Buku</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBook(book);
                  setEditModalOpen(true);
                }}
              >
                <Info className="mr-2 h-4 w-4 text-blue-500" />
                Edit Detail / Stok
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(book.id)}
              >
                Hapus dari Katalog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];