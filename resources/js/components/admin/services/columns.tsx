import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import * as Icons from "lucide-react"; // 🔥 import semua icon
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/pages/admin/cms/Services";

/* ======================
   DELETE
====================== */
const handleDelete = (id: number) => {
  if (confirm("Yakin hapus layanan ini?")) {
    router.delete(`/admin/services/${id}`, {
      preserveScroll: true,
    });
  }
};

/* ======================
   ICON RENDER HELPER
====================== */
const renderIcon = (iconName: string) => {
  // cek apakah emoji
  if (!iconName) return null;

  // jika bukan huruf (kemungkinan emoji)
  if (!/^[a-zA-Z]/.test(iconName)) {
    return <span className="text-xl">{iconName}</span>;
  }

  // convert ke PascalCase (layout-grid → LayoutGrid)
  const formattedName = iconName
    .replace(/(^\w|-\w)/g, (match) =>
      match.replace("-", "").toUpperCase()
    );

  const LucideIcon = (Icons as any)[formattedName];

  if (LucideIcon) {
    return <LucideIcon className="h-5 w-5" />;
  }

  // fallback jika tidak ditemukan
  return <span className="text-xs text-red-500">?</span>;
};

/* ======================
   COLUMNS
====================== */
export const columns = (
  onEdit: (service: Service) => void
): ColumnDef<Service>[] => [
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {renderIcon(row.original.icon)}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Layanan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.original.subtitle}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "order",
      header: "Urutan",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "secondary"}>
          {row.original.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            className="text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];