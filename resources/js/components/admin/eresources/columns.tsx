import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Calendar, Database, User, Key, Lock, Clock } from "lucide-react";
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
export type EresourceAccess = {
  id: number;
  user_id: number;
  resource_name: string;
  username_given: string | null;
  password_given: string | null;
  expiry_date: string | null;
  user?: { name: string };
  created_at: string;
};

/* =====================
    DELETE
===================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin ingin menghapus akses e-resource ini?")) {
    router.delete(`/admin/eresource-access/${id}`, {
      preserveScroll: true,
    });
  }
};

/* =====================
    COLUMNS
===================== */
export const columns = (
  setEditModalOpen: (open: boolean) => void,
  setSelectedAccess: (access: EresourceAccess) => void
): ColumnDef<EresourceAccess>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "user.name",
      header: "Pengguna",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-900">{row.original.user?.name || "N/A"}</span>
          </div>
          <span className="text-[10px] text-slate-400 ml-6">ID: {row.original.user_id}</span>
        </div>
      ),
    },
    {
      accessorKey: "resource_name",
      header: "Database / Resource",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-500" />
          <span className="font-semibold text-indigo-700">{row.original.resource_name}</span>
        </div>
      ),
    },
    {
      header: "Kredensial Diberikan",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5">
            <Key className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600">{row.original.username_given || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600 font-mono">••••••••</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "expiry_date",
      header: "Masa Berlaku",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiry_date");
        if (!expiryDate) return <span className="text-slate-400 italic">No Expiry</span>;

        const date = new Date(expiryDate as string);
        const isExpired = date < new Date();

        return (
          <div className={`flex items-center gap-2 text-sm ${isExpired ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
            <Clock className="h-3 w-3" />
            {date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
            {isExpired && <Badge variant="destructive" className="ml-1 text-[10px] h-4">Expired</Badge>}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const access = row.original;

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
                  setSelectedAccess(access);
                  setEditModalOpen(true);
                }}
              >
                Edit Akun / Tanggal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(access.id)}
              >
                Cabut Akses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];