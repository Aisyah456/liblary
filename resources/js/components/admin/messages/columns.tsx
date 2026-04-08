import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, MessageSquareText, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js"; // Tambahkan ini
import type { Message } from "@/pages/admin/cms/Kontak";

/* ======================
   DELETE LOGIC
====================== */
const handleDelete = (id: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
    // Gunakan route() agar sinkron dengan Laravel
    router.delete(route('admin.messages.destroy', id), {
      preserveScroll: true,
    });
  }
}

/* ======================
   COLUMNS DEFINITION
====================== */
export const columns = (
  onView: (message: Message) => void
): ColumnDef<Message>[] => [
    {
      accessorKey: "nama_lengkap",
      header: "Pengirim",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.original.nama_lengkap}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
          {row.original.nim_nidn && (
            <span className="text-[10px] font-mono text-indigo-600">{row.original.nim_nidn}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "subjek",
      header: "Subjek & Pesan",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[300px]">
          <Badge variant="outline" className="w-fit mb-1 text-[10px] h-5">
            {row.original.subjek}
          </Badge>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.pesan}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const isSelesai = status === "selesai";

        return (
          <Badge
            variant={isSelesai ? "default" : "secondary"}
            className={`gap-1.5 ${isSelesai ? "bg-green-500 hover:bg-green-600" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}
          >
            {isSelesai ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {isSelesai ? "Selesai" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <div className="text-xs text-muted-foreground">
            {date.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <MessageSquareText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];