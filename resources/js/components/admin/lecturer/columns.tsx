import { router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* =====================
    TYPES
===================== */
export type Lecturer = {
    id: number;
    nidn: string;
    nama_lengkap: string;
    email: string;
    jenis_kelamin: 'L' | 'P';
    program_studi: string;
    jabatan_fungsional?: string;
    alamat?: string;
    telepon?: string;
    created_at?: string;
};

/* =====================
    DELETE LOGIC
===================== */
const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data dosen ini?")) {
        // Sesuaikan route dengan backend Anda, misal: /lecturers/
        router.delete(`/lecturers/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Berhasil dihapus
            },
            onError: (errors) => {
                console.error(errors);
                alert("Gagal menghapus data.");
            }
        });
    }
};

/* =====================
    COLUMNS DEFINITION
===================== */
export const columns = (
    setEditModalOpen: (open: boolean) => void,
    setSelectedLecturer: (lecturer: Lecturer) => void
): ColumnDef<Lecturer>[] => [
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
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>
        },
        {
            accessorKey: "nidn",
            header: "NIDN",
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.nidn}</span>
        },
        {
            accessorKey: "nama_lengkap",
            header: "Nama Dosen",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{row.original.nama_lengkap}</span>
                    {/* <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Mail className="h-3 w-3" /> {row.original.email}
                    </div> */}
                </div>
            )
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.email}</span>
        },
        {
            accessorKey: "jenis_kelamin",
            header: "JK",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </Badge>
            )
        },
        {
            accessorKey: "program_studi",
            header: "Program Studi",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{row.original.program_studi}</span>
                    <span className="text-[10px] text-muted-foreground uppercase italic">
                        {row.original.jabatan_fungsional || "Tanpa Jabatan"}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "telepon",
            header: "Kontak",
            cell: ({ row }) => (
                <span className="text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {row.original.telepon || "-"}
                </span>
            )
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const lecturer = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={() => {
                                navigator.clipboard.writeText(lecturer.nidn);
                                // Tambahkan toast notification di sini jika ada
                            }}
                            title="Salin NIDN"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                                setSelectedLecturer(lecturer);
                                setEditModalOpen(true);
                            }}
                            title="Update"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(lecturer.id)}
                            title="Hapus"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];