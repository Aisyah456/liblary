import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, ExternalLink } from "lucide-react";

export type LibraryFreeRow = {
  id: number;
  full_name: string;
  nim: string;
  email: string;
  phone_number: string;
  faculty_id: number;
  major_id: number;
  degree_level: string;
  purpose: string;
  entry_year: number;
  graduation_year: number;
  scientific_paper_path: string;
  ktm_scan_path: string;
  upload_proof_path?: string | null;
  turnitin_similarity_score: number | null;
  turnitin_report_url?: string | null;
  status: 'pending' | 'verifying' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  // Relasi dari Backend
  faculty?: { name: string };
  major?: { name: string };
};

export const columns = (onEdit: (row: LibraryFreeRow) => void): ColumnDef<LibraryFreeRow>[] => [
  {
    accessorKey: "nim",
    header: "NIM",
  },
  {
    accessorKey: "full_name",
    header: "Nama Mahasiswa",
  },
  {
    accessorKey: "major.name",
    header: "Jurusan",
    cell: ({ row }) => row.original.major?.name || "-",
  },
  {
    accessorKey: "turnitin_similarity_score",
    header: "Turnitin",
    cell: ({ row }) => {
      const score = row.original.turnitin_similarity_score;
      if (score === null) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col gap-1">
          <span className={`font-medium ${Number(score) > 25 ? "text-red-600" : "text-emerald-600"}`}>
            {score}%
          </span>
          {row.original.turnitin_report_url && (
            <a
              href={row.original.turnitin_report_url}
              target="_blank"
              className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5"
            >
              Laporan <ExternalLink className="h-2 w-2" />
            </a>
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
      const variants: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent shadow-none",
        verifying: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent shadow-none",
        approved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-transparent shadow-none",
        rejected: "bg-red-100 text-red-800 hover:bg-red-100 border-transparent shadow-none",
      };

      const labels: Record<string, string> = {
        pending: "MENUNGGU",
        verifying: "PROSES",
        approved: "BERHASIL",
        rejected: "DITOLAK",
      };

      return <Badge className={`text-[10px] px-2 py-0 ${variants[status]}`}>{labels[status]}</Badge>;
    }
  },
  {
    id: "files",
    header: "Dokumen",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <a
          href={`/storage/${row.original.scientific_paper_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
        >
          <FileText className="h-3.5 w-3.5" />
          Karya Ilmiah
        </a>
        <a
          href={`/storage/${row.original.ktm_scan_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-[11px]"
        >
          <FileText className="h-3 w-3" />
          Scan KTM
        </a>
      </div>
    )
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 border-slate-200"
          onClick={() => onEdit(row.original)}
        >
          <Eye className="h-3.5 w-3.5" />
          Detail
        </Button>
      </div>
    ),
  },
];