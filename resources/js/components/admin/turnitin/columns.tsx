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
  AlertCircle,
  GraduationCap,
  Percent
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
    TYPE (Sesuai DB Schema)
===================== */
export type TurnitinSubmission = {
  id: number;
  major_id: number;
  identifier_id: string;
  full_name: string;
  email: string;
  title: string;
  document_type: string;
  file_path: string;
  academic_year: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected'; // lowercase sesuai DB
  similarity_percentage?: number | null;
  result_file_path?: string | null;
  admin_notes?: string | null;
  created_at: string;
  major?: { name: string }; // Relasi ke tabel prodi
};

/* =====================
    DELETE ACTION
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus pengajuan ini secara permanen?")) {
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
      header: "Informasi Pengaju",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-900">{row.original.full_name}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 ml-6 uppercase font-semibold">
            <span>{row.original.identifier_id}</span>
            <span>•</span>
            <span className="text-indigo-500 font-normal">{row.original.major?.name || 'Umum'}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Dokumen",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[250px]">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
            <span className="font-medium text-slate-800 line-clamp-2 leading-tight">
              {row.original.title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 ml-6 text-[11px]">
            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 uppercase bg-slate-100">
              {row.original.document_type}
            </Badge>
            <span className="text-slate-400">{row.original.academic_year}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "similarity_percentage",
      header: "Hasil Similarity",
      cell: ({ row }) => {
        const percentage = row.original.similarity_percentage;
        if (percentage === null || percentage === undefined) return <span className="text-slate-300 italic text-xs">Belum ada hasil</span>;

        // Warna dinamis berdasarkan persentase
        const getSimilarityColor = (p: number) => {
          if (p <= 20) return "text-emerald-600";
          if (p <= 40) return "text-amber-600";
          return "text-red-600";
        };

        return (
          <div className={`flex items-center gap-1.5 font-bold ${getSimilarityColor(percentage)}`}>
            <Percent className="h-3.5 w-3.5" />
            {percentage}%
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, { label: string, className: string, icon: any }> = {
          pending: { label: 'Menunggu', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
          processing: { label: 'Diproses', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
          completed: { label: 'Selesai', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
          rejected: { label: 'Ditolak', className: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
          <Badge variant="outline" className={`flex w-fit items-center gap-1.5 px-2 py-0.5 font-medium capitalize ${config.className}`}>
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
            {/* Tombol Download File Asli */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-slate-600 border-slate-200 hover:bg-slate-50"
              onClick={() => window.open(`/admin/turnitin/download-original/${submission.id}`, '_blank')}
              title="Download Dokumen Asli"
            >
              <Download className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Opsi Kelola</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setProcessModalOpen(true);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Update Hasil / Status
                </DropdownMenuItem>

                {submission.result_file_path && (
                  <DropdownMenuItem
                    className="cursor-pointer text-emerald-600"
                    onClick={() => window.open(`/storage/${submission.result_file_path}`, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Hasil PDF
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(submission.id)}
                >
                  Hapus Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];