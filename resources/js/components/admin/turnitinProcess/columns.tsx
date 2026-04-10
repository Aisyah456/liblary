import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  FileText,
  Download,
  Tag,
  Clock,
  AlertCircle,
  FileCheck,
  ExternalLink,
  Mail,
  GraduationCap
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

// Import Type
import type { TurnitinSubmission } from "@/pages/admin/Turnitin/TurnitinProcess";

/* =====================
    DELETE ACTION
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus data pengajuan ini?")) {
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
  setSelectedSubmission: (submission: TurnitinSubmission) => void
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
      header: "Identitas Pengaju",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.original.full_name}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
              {row.original.identifier_id}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <Mail className="h-2.5 w-2.5" /> {row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Detail Dokumen",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[280px]">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
            <span className="font-medium line-clamp-2 text-xs leading-relaxed">{row.original.title}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">{row.original.document_type}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 italic text-[10px]">
              <GraduationCap className="h-3 w-3" />
              {row.original.academic_year}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "similarity_percentage",
      header: "Hasil Cek",
      cell: ({ row }) => {
        const percentage = row.original.similarity_percentage;
        const status = row.original.status;

        if (status === 'pending' || percentage === null) return (
          <div className="flex items-center gap-1.5 text-slate-400 italic">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px]">Belum dianalisis</span>
          </div>
        );

        let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (percentage > 25) badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
        else if (percentage > 15) badgeClass = "bg-amber-50 text-amber-700 border-amber-200";

        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={`w-fit font-black text-xs px-2 ${badgeClass}`}>
              {percentage}% Similarity
            </Badge>
            {row.original.updated_at && (
              <span className="text-[9px] text-slate-400 uppercase tracking-tighter">
                Diperbarui: {new Date(row.original.updated_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const configs: Record<string, { label: string, color: string, icon: any }> = {
          pending: { label: 'Antrean', color: 'bg-slate-100 text-slate-600', icon: Clock },
          processing: { label: 'Proses', color: 'bg-sky-100 text-sky-700', icon: Loader2 },
          completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
          rejected: { label: 'Ditolak', color: 'bg-rose-100 text-rose-700', icon: AlertCircle },
        };
        const config = configs[status] || configs.pending;

        return (
          <Badge className={`${config.color} border-none shadow-none font-bold text-[10px] uppercase tracking-wider px-2 py-0.5`}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const submission = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="h-8 bg-teal-600 hover:bg-teal-700 shadow-sm"
              onClick={() => {
                setSelectedSubmission(submission);
                setProcessModalOpen(true);
              }}
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Proses
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Manajemen Dokumen</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => window.open(`/storage/${submission.file_path}`, '_blank')}>
                  <Download className="mr-2 h-4 w-4 text-blue-500" />
                  Lihat Dokumen Asli
                </DropdownMenuItem>

                {submission.result_file_path && (
                  <DropdownMenuItem onClick={() => window.open(`/storage/${submission.result_file_path}`, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4 text-emerald-500" />
                    Unduh Hasil Turnitin
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                  onClick={() => handleDelete(submission.id)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Hapus Pengajuan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ];

// Helper icon untuk Loader di status (opsional jika Loader2 diimport)
import { Loader2 } from "lucide-react";