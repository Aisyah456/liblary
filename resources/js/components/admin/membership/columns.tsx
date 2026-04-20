import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User, GraduationCap } from "lucide-react";
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


export type Membership = {
  id: number;
  memberable_type: string;
  memberable_id: number;
  library_card_number: string;
  status: 'Aktif' | 'Nonaktif';
  joined_at: string;
  expires_at: string | null;

  memberable: {
    nama_lengkap?: string; 
    user?: { name: string }; 
    nim?: string;
    nidn?: string;
  };
};


const handleDelete = (id: number) => {
  if (confirm("Hapus keanggotaan ini? Data profil tetap ada, namun akses perpustakaan akan dicabut.")) {
    router.delete(`/admin/memberships/${id}`, {
      preserveScroll: true,
    });
  }
};


export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedMembership: (membership: Membership) => void
): ColumnDef<Membership>[] => [
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
      accessorKey: "library_card_number",
      header: "No. Kartu",
      cell: ({ row }) => <span className="font-mono font-bold text-xs">{row.original.library_card_number}</span>
    },
    {
      id: "member_info",
      header: "Nama Anggota",
      cell: ({ row }) => {
        const member = row.original;
        const isLecturer = member.memberable_type.includes("Lecturer");
        const name = isLecturer
          ? member.memberable.nama_lengkap
          : member.memberable.user?.name;
        const identifier = isLecturer ? member.memberable.nidn : member.memberable.nim;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {isLecturer ? <GraduationCap className="h-3 w-3 text-blue-500" /> : <User className="h-3 w-3 text-orange-500" />}
              <span className="font-medium">{name || "Tidak diketahui"}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase">{isLecturer ? 'Dosen' : 'Mahasiswa'} • {identifier}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "Aktif" ? "default" : "destructive"}>
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "joined_at",
      header: "Tgl Gabung",
      cell: ({ row }) => new Date(row.original.joined_at).toLocaleDateString('id-ID'),
    },
    {
      accessorKey: "expires_at",
      header: "Masa Berlaku",
      cell: ({ row }) => {
        const date = row.original.expires_at;
        if (!date) return <span className="text-muted-foreground">-</span>;

        const isExpired = new Date(date) < new Date();
        return (
          <span className={isExpired ? "text-red-500 font-semibold" : ""}>
            {new Date(date).toLocaleDateString('id-ID')}
            {isExpired && " (Habis)"}
          </span>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const membership = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMembership(membership);
                  setEditModalOpen(true);
                }}
              >
                Update Keanggotaan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(membership.id)}
              >
                Hapus Anggota
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];