"use client"

import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Settings2,
    ChevronLeft,
    ChevronRight,
    Search,
    Download,
    Filter,
} from "lucide-react"
import * as React from "react"

import * as XLSX from "xlsx"
import { Badge } from "@/components/ui/badge"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    searchKey,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const exportToExcel = () => {
        // Mengambil data yang sudah difilter/sortir saat ini
        const rows = table.getFilteredRowModel().rows;
        if (rows.length === 0) return;

        const exportData = rows.map((row) => {
            const original = { ...(row.original as Record<string, unknown>) };

            // Membersihkan kolom yang tidak perlu diekspor (seperti kolom aksi/icon)
            delete original.icon;
            delete original.actions;

            // Transformasi boolean status menjadi teks yang ramah user
            if (Object.prototype.hasOwnProperty.call(original, 'is_active')) {
                original.status = original.is_active ? "Aktif" : "Nonaktif";
                delete original.is_active;
            }

            return original;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const fileName = `Export_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    return (
        <div className="w-full space-y-4">
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchKey ? `Cari ${searchKey.replace(/_/g, " ")}...` : "Cari data..."}
                        value={
                            searchKey
                                ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                                : globalFilter
                        }
                        onChange={(event) => {
                            if (searchKey) {
                                table.getColumn(searchKey)?.setFilterValue(event.target.value)
                            } else {
                                // Global filter jika searchKey tidak disediakan
                                setGlobalFilter(event.target.value)
                            }
                        }}
                        className="pl-9 h-10"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* FILTER STATUS - Hanya muncul jika kolom is_active ada */}
                    {table.getColumn("is_active") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-2 border-dashed">
                                    <Filter className="h-4 w-4" />
                                    Status
                                    {table.getColumn("is_active")?.getFilterValue() !== undefined && (
                                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                                            1
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={table.getColumn("is_active")?.getFilterValue() === true}
                                    onCheckedChange={(v) => table.getColumn("is_active")?.setFilterValue(v ? true : undefined)}
                                >
                                    Aktif
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={table.getColumn("is_active")?.getFilterValue() === false}
                                    onCheckedChange={(v) => table.getColumn("is_active")?.setFilterValue(v ? false : undefined)}
                                >
                                    Nonaktif
                                </DropdownMenuCheckboxItem>
                                {table.getColumn("is_active")?.getFilterValue() !== undefined && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-center text-xs h-8"
                                            onClick={() => table.getColumn("is_active")?.setFilterValue(undefined)}
                                        >
                                            Reset Filter
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 border-emerald-600/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Excel</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 gap-2">
                                <Settings2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Kolom</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Konfigurasi Kolom</DropdownMenuLabel>
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

            {/* TABLE CONTAINER */}
            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                        Tidak ada data yang tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Menampilkan <strong>{table.getRowModel().rows.length}</strong> dari <strong>{table.getFilteredRowModel().rows.length}</strong> data.
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 order-1 sm:order-2">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Baris per halaman</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(v) => table.setPageSize(Number(v))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 50].map((size) => (
                                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm font-medium min-w-[100px] text-center">
                        Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
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