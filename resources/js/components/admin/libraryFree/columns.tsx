import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

export type LibraryFreeRow = {
  id: number;
  full_name: string;
  nim: string;
  email: string;
  phone_number: string;
  degree_level: string;
  purpose: string;
  entry_year: number;
  graduation_year: number;
  scientific_paper_path: string; // Ditambahkan
  ktm_scan_path: string;         // Ditambahkan
  upload_proof_path?: string;    // Ditambahkan
  status: 'pending' | 'verifying' | 'approved' | 'rejected';
  turnitin_similarity_score: number | null;
  admin_notes: string | null;
  created_at: string;
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
    accessorKey: "major.name", // Menampilkan Nama Jurusan
    header: "Jurusan",
    cell: ({ row }) => row.original.major?.name || "-",
  },
  {
    accessorKey: "turnitin_similarity_score",
    header: "Turnitin",
    cell: ({ row }) => {
      const score = row.original.turnitin_similarity_score;
      // Gunakan pengecekan null agar skor 0% tetap muncul
      return score !== null ? (
        <span className={score > 25 ? "text-red-600 font-medium" : ""}>
          {score}%
        </span>
      ) : "-";
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent shadow-none",
        verifying: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent shadow-none",
        approved: "bg-green-100 text-green-800 hover:bg-green-200 border-transparent shadow-none",
        rejected: "bg-red-100 text-red-800 hover:bg-red-200 border-transparent shadow-none",
      };

      const labels: Record<string, string> = {
        pending: "MENUNGGU",
        verifying: "VERIFIKASI",
        approved: "DISETUJUI",
        rejected: "DITOLAK",
      };

      return <Badge className={variants[status]}>{labels[status]}</Badge>;
    }
  },
  // {
  //   id: "files",
  //   header: "Berkas",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //       <a
  //         href={`${process.env.NEXT_PUBLIC_ASSET_URL}/${row.original.scientific_paper_path}`}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
  //       >
  //         <FileText className="h-3.3 w-3.5" />
  //         Karya Ilmiah
  //       </a>
  //     </div>
  //   )
  // },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(row.original)}
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Lihat Detail</span>
        </Button>
      </div>
    ),
  },
]; 