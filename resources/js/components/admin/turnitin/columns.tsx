import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  User,
  FileText,
  Download,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
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

/* =====================
    TYPE
===================== */
export type TurnitinSubmission = {
  id: number;
  user_id: number;
  full_name: string;
  identifier_id: string; // NIM / NIDN
  title: string;
  document_type: 'Skripsi' | 'Tesis' | 'Artikel';
  file_path: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  created_at: string;
};

/* =====================
    DELETE / CANCEL
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus pengajuan ini?")) {
    router.delete(`/admin/turnitin/submissions/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
  setProcessModalOpen: (open: boolean) => void,
  setSelectedSubmission: (submission: TurnitinSubmission | null) => void
): ColumnDef<TurnitinSubmission>[] => [
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
      accessorKey: "full_name",
      header: "Mahasiswa / Dosen",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-900">{row.original.full_name}</span>
          </div>
          <span className="text-[10px] text-slate-400 ml-6 uppercase">{row.original.identifier_id}</span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Informasi Karya",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[300px]">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-indigo-500 mt-1 shrink-0" />
            <span className="font-semibold text-slate-800 line-clamp-2 leading-tight">
              {row.original.title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 ml-6">
            <Tag className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500">{row.original.document_type}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Pengajuan",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar className="h-3 w-3" />
          {new Date(row.original.created_at).toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, { label: string, className: string, icon: any }> = {
          Pending: { label: 'Menunggu', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
          Processing: { label: 'Diproses', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
          Completed: { label: 'Selesai', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
          Rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
        };

        const config = variants[status] || variants.Pending;
        const Icon = config.icon;

        return (
          <Badge variant="outline" className={`flex w-fit items-center gap-1.5 px-2 py-0.5 font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const submission = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* Tombol Cepat Download File Asli */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() => window.open(`/admin/turnitin/download/${submission.id}`, '_blank')}
              title="Download Dokumen"
            >
              <Download className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi Turnitin</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setProcessModalOpen(true);
                  }}
                >
                  Proses & Input Hasil
                </DropdownMenuItem>
                <DropdownMenuItem>Lihat Detail Pengaju</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(submission.id)}
                >
                  Hapus Pengajuan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];