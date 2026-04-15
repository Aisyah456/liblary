import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Building2, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type PartnerRow = {
  id: number;
  name: string;
  logo: string | null;
  type: 'supplier' | 'mitra' | 'donator';
  email: string | null;
  phone: string | null;
  address: string | null;
  contact_person: string | null;
  mou_number: string | null;
  partnership_expiry: string | null; // ISO Date string
  is_active: boolean;
  created_at: string;
};

const handleDelete = (id: number) => {
  if (confirm("Hapus data rekanan ini?")) {
    router.delete(`/admin/partners/${id}`, { preserveScroll: true });
  }
};

export const columns = (
  onEdit: (partner: PartnerRow) => void
): ColumnDef<PartnerRow>[] => [
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
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const logoPath = row.original.logo;

        // Fungsi untuk membersihkan path jika di DB tersimpan "public/logos/abc.jpg"
        // Laravel storage:link memetakan "public/storage" ke "storage/app/public"
        const getImageUrl = (path: string) => {
          if (path.startsWith('http')) return path; // Jika URL eksternal
          const cleanPath = path.replace(/^public\//, ''); // Hapus "public/" di awal jika ada
          return `/storage/${cleanPath}`;
        };

        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-slate-50 overflow-hidden">
            {logoPath ? (
              <img
                src={getImageUrl(logoPath)}
                alt={row.original.name}
                className="h-full w-full object-contain p-1" // object-contain lebih aman untuk logo agar tidak terpotong
                onError={(e) => {
                  // Fallback jika gambar gagal dimuat (404)
                  e.currentTarget.src = "";
                  e.currentTarget.classList.add("hidden");
                }}
              />
            ) : (
              <Building2 className="h-5 w-5 text-slate-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Instansi/Perusahaan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{row.original.name}</span>
          <span className="text-[11px] text-muted-foreground">{row.original.type.toUpperCase()}</span>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Kontak",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs">
          {row.original.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {row.original.email}
            </div>
          )}
          {row.original.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={row.original.is_active ? "bg-emerald-500" : "bg-slate-400"}>
          {row.original.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];