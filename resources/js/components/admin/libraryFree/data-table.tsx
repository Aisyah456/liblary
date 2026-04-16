"use client"

import * as React from "react"
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState
} from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Settings2, ChevronLeft, ChevronRight, Search, Download, Filter, X } from "lucide-react"
import * as XLSX from 'xlsx'

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
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = "full_name",
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

    const exportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row: any) => {
            const item = row.original;
            return {
                "ID": item.id,
                "NIM": item.nim,
                "Nama Lengkap": item.full_name,
                "Email": item.email,
                "No HP": item.phone_number,
                "Fakultas": item.faculty?.name || "-",
                "Jurusan": item.major?.name || "-",
                "Jenjang": item.degree_level,
                "Keperluan": item.purpose,
                "Tahun Masuk": item.entry_year,
                "Tahun Lulus": item.graduation_year,
                "Skor Turnitin": item.turnitin_similarity_score ? `${item.turnitin_similarity_score}%` : "-",
                "Status": item.status.toUpperCase(),
                "Catatan Admin": item.admin_notes || "-",
                "Tanggal Pengajuan": item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : "-"
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bebas Pustaka");

        // Atur lebar kolom otomatis (Opsional tapi disarankan)
        const maxWidth = 20;
        worksheet["!cols"] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

        XLSX.writeFile(workbook, `Data_Bebas_Pustaka_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const currentStatusFilter = table.getColumn("status")?.getFilterValue() as string;

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama mahasiswa..."
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-8 bg-background"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
                    {/* Status Filter Indicator */}
                    {currentStatusFilter && (
                        <Badge variant="secondary" className="h-9 gap-1 px-3 hidden lg:flex">
                            Status: {currentStatusFilter}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                            />
                        </Badge>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Status</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { label: 'Menunggu', value: 'pending' },
                                { label: 'Verifikasi', value: 'verifying' },
                                { label: 'Disetujui', value: 'approved' },
                                { label: 'Ditolak', value: 'rejected' }
                            ].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status.value}
                                    checked={currentStatusFilter === status.value}
                                    onCheckedChange={(checked) =>
                                        table.getColumn("status")?.setFilterValue(checked ? status.value : undefined)
                                    }
                                >
                                    {status.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                            {currentStatusFilter && (
                                <>
                                    <DropdownMenuSeparator />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-center font-medium text-destructive"
                                        onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                                    >
                                        Hapus Filter
                                    </Button>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                        onClick={exportToExcel}
                        disabled={data.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export Excel</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Settings2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Kolom</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
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

            <div className="rounded-md border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 font-bold text-foreground">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-4 py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                        Data tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                    {table.getFilteredRowModel().rows.length} baris dipilih.
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8 order-1 sm:order-2">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Halaman</p>
                        <strong className="text-sm">
                            {table.getState().pagination.pageIndex + 1} dari{" "}
                            {table.getPageCount()}
                        </strong>
                    </div>
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