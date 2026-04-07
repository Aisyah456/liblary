import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Trash2, ExternalLink, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* =====================
    TYPES
===================== */
export type LibraryFree = {
  id: number;
  full_name: string;
  nim: string;
  phone_number: string;
  email: string;
  faculty_id: number;
  major_id: number;
  degree_level: string;
  purpose: string;
  entry_year: number;
  graduation_year: number;
  scientific_paper_path: string;
  ktm_scan_path: string;
  upload_proof_path?: string;
  turnitin_similarity_score?: number | string;
  turnitin_report_url?: string;
  status: 'pending' | 'verifying' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  faculty?: { id: number; name: string; };
  major?: { id: number; name: string; };
};

/* =====================
    DELETE LOGIC
===================== */
const handleDelete = (id: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus data pengajuan ini? Tindakan ini tidak dapat dibatalkan.")) {
    router.delete(`/library-frees/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS DEFINITION
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedData: (data: LibraryFree) => void
): ColumnDef<LibraryFree>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "full_name",
      header: "Mahasiswa",
      accessorFn: (row) => `${row.full_name} ${row.nim}`,
      cell: ({ row }) => (
        <div className="flex flex-col py-1">
          <span className="font-semibold text-sm leading-none mb-1">
            {row.original.full_name}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono bg-slate-100 px-1 rounded text-slate-600">
              {row.original.nim}
            </span>
          </div>
        </div>
      )
    },
    {
      id: "akademik",
      header: "Prodi & Jenjang",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.major?.name || "-"}</span>
          <span className="text-muted-foreground">{row.original.degree_level} • {row.original.graduation_year}</span>
        </div>
      )
    },
    {
      accessorKey: "turnitin_similarity_score",
      header: "Similarity",
      cell: ({ row }) => {
        const score = parseFloat(row.original.turnitin_similarity_score?.toString() || "0");
        if (!row.original.turnitin_similarity_score) return <span className="text-muted-foreground">-</span>;

        // Warna indikator berdasarkan skor (Contoh: > 25% dianggap tinggi/merah)
        const scoreColor = score > 25 ? "text-red-600 font-bold" : "text-emerald-600";

        return (
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm ${scoreColor}`}>{score}%</span>
            {row.original.turnitin_report_url && (
              <a href={row.original.turnitin_report_url} target="_blank" rel="noreferrer" title="Lihat Laporan Turnitin">
                <ExternalLink className="h-3 w-3 text-slate-400 hover:text-blue-500" />
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

        // Custom styling agar lebih "berwarna" dibanding default Shadcn
        const statusConfig: Record<string, { label: string, className: string }> = {
          approved: { label: "Disetujui", className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
          verifying: { label: "Diverifikasi", className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" },
          pending: { label: "Menunggu", className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100" },
          rejected: { label: "Ditolak", className: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100" },
        };

        const config = statusConfig[status] || { label: status, className: "" };

        return (
          <Badge variant="outline" className={`font-medium shadow-none ${config.className}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right mr-4">Aksi</div>,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            {/* Quick View Paper */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-indigo-600"
              asChild
            >
              <a href={`/storage/${data.scientific_paper_path}`} target="_blank" rel="noreferrer" title="Lihat Karya Ilmiah">
                <FileSearch className="h-4 w-4" />
              </a>
            </Button>

            {/* Edit / Process */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSelectedData(data);
                setEditModalOpen(true);
              }}
              title="Proses Verifikasi"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:bg-rose-50"
              onClick={() => handleDelete(data.id)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];