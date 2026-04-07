"use client"

import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Settings2, ChevronLeft, ChevronRight, Search, Download, Filter } from "lucide-react"
import * as React from "react"

import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = "full_name", // Default pencarian diubah ke nama lengkap mahasiswa
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Fungsi Export Excel disesuaikan dengan field Bebas Pustaka
    const exportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row: any) => {
            const item = row.original;
            return {
                ID: item.id,
                NIM: item.nim,
                Nama_Lengkap: item.full_name,
                Email: item.email,
                No_HP: item.phone_number,
                // Asumsi data relasi faculty dan major di-load dari backend (eager loading)
                Fakultas: item.faculty?.name || "-",
                Jurusan: item.major?.name || "-",
                Jenjang: item.degree_level,
                Keperluan: item.purpose,
                Tahun_Masuk: item.entry_year,
                Tahun_Lulus: item.graduation_year,
                Skor_Turnitin: item.turnitin_similarity_score ? `${item.turnitin_similarity_score}%` : "Belum ada",
                Status: item.status,
                Catatan_Admin: item.admin_notes || "-",
                Tanggal_Pengajuan: new Date(item.created_at).toLocaleDateString('id-ID')
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Bebas Pustaka");
        XLSX.writeFile(workbook, "Data_Bebas_Pustaka.xlsx");
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-sm:max-w-none max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Cari nama mahasiswa...`}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* Filter Status Pengajuan */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Filter className="h-4 w-4" />
                                Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Disesuaikan dengan Enum di Database */}
                            {[
                                { label: 'Menunggu', value: 'pending' },
                                { label: 'Verifikasi', value: 'verifying' },
                                { label: 'Disetujui', value: 'approved' },
                                { label: 'Ditolak', value: 'rejected' }
                            ].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status.value}
                                    checked={table.getColumn("status")?.getFilterValue() === status.value}
                                    onCheckedChange={(value) =>
                                        table.getColumn("status")?.setFilterValue(value ? status.value : undefined)
                                    }
                                >
                                    {status.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start font-normal text-red-600 hover:text-red-700"
                                onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                            >
                                Reset Filter
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 text-green-700 border-green-200 hover:bg-green-50"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 lg:flex gap-2">
                                <Settings2 className="h-4 w-4" />
                                Kolom
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle Kolom</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id.replace(/_/g, " ")}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-foreground">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="transition-colors hover:bg-muted/30">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    Tidak ada data pengajuan bebas pustaka ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                    {table.getFilteredRowModel().rows.length} data dipilih.
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <p className="text-sm font-medium text-muted-foreground">
                        Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                        {table.getPageCount()}
                    </p>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}