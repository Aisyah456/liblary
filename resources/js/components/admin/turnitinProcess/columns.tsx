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
  FileCheck,
  ExternalLink
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

// Import Type dari Index (atau definisikan ulang di sini jika perlu)
import type { TurnitinSubmission } from "@/pages/admin/Turnitin/TurnitinProcess";

/* =====================
    DELETE / CANCEL
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus data pengajuan dan hasil ini?")) {
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
      header: "Pengaju",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.original.full_name}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{row.original.identifier_id}</span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Informasi Karya",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[250px]">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="font-medium line-clamp-1 text-sm">{row.original.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Tag className="h-3 w-3 text-slate-300" />
            <span className="text-[11px] text-slate-500">{row.original.document_type}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Hasil Similarity",
      cell: ({ row }) => {
        const result = row.original.result;
        if (!result) return (
          <div className="flex items-center gap-1.5 text-amber-500">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs italic font-medium">Belum Dicek</span>
          </div>
        );

        const percentage = result.similarity_percentage;
        let badgeClass = "bg-emerald-100 text-emerald-700 border-emerald-200"; // Lulus
        if (percentage > 25) badgeClass = "bg-red-100 text-red-700 border-red-200"; // Tinggi
        else if (percentage > 15) badgeClass = "bg-orange-100 text-orange-700 border-orange-200"; // Sedang

        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={`w-fit font-bold text-sm ${badgeClass}`}>
              {percentage}%
            </Badge>
            <span className="text-[10px] text-slate-400">Cek: {new Date(result.check_date).toLocaleDateString('id-ID')}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const configs: Record<string, { label: string, color: string }> = {
          Pending: { label: 'Menunggu', color: 'bg-slate-100 text-slate-600' },
          Processing: { label: 'Proses', color: 'bg-blue-100 text-blue-600' },
          Completed: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
          Rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-600' },
        };
        const config = configs[status] || configs.Pending;

        return (
          <Badge className={`${config.color} border-none shadow-none font-medium`}>
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
            {/* Primary Action: Input Hasil */}
            <Button
              size="sm"
              variant="default"
              className="h-8 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setSelectedSubmission(submission);
                setProcessModalOpen(true);
              }}
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Input Hasil
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Opsi Dokumen</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => window.open(`/admin/turnitin/download/${submission.id}`, '_blank')}>
                  <Download className="mr-2 h-4 w-4 text-blue-500" />
                  Download Dokumen
                </DropdownMenuItem>

                {submission.result?.evidence_path && (
                  <DropdownMenuItem onClick={() => window.open(`/storage/${submission.result?.evidence_path}`, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4 text-emerald-500" />
                    Lihat Bukti Hasil
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(submission.id)}>
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