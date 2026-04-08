"use client"

import * as React from "react"
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState
} from "@tanstack/react-table";
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
    X,
} from "lucide-react"

import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
}

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    searchKey = "title",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    /* =========================
        EXPORT EXCEL (Optimized)
    ========================== */
    const exportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const original = { ...row.original };
            // Hapus data sensitif atau yang tidak perlu di excel
            delete original.icon;
            delete original.id;

            // Opsional: Format boolean menjadi teks agar lebih mudah dibaca di Excel
            if (typeof original.is_active !== 'undefined') {
                original.is_active = original.is_active ? "Aktif" : "Nonaktif";
            }

            return original;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, `Export_${new Date().getTime()}.xlsx`);
    }

    return (
        <div className="w-full space-y-4">
            {/* ========================= HEADER ========================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* SEARCH SECTION */}
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Cari ${searchKey}...`}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-9 h-10 ring-offset-background focus-visible:ring-1"
                    />
                    {table.getColumn(searchKey)?.getFilterValue() && (
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => table.getColumn(searchKey)?.setFilterValue("")}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* FILTER STATUS (Conditional) */}
                    {table.getColumn("is_active") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-2 border-dashed">
                                    <Filter className="h-4 w-4" />
                                    Status
                                    {table.getColumn("is_active")?.getFilterValue() !== undefined && (
                                        <Badge variant="secondary" className="ml-1 px-1 font-mono text-[10px]">
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
                                    onCheckedChange={(value) =>
                                        table.getColumn("is_active")?.setFilterValue(value ? true : undefined)
                                    }
                                >
                                    Aktif
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={table.getColumn("is_active")?.getFilterValue() === false}
                                    onCheckedChange={(value) =>
                                        table.getColumn("is_active")?.setFilterValue(value ? false : undefined)
                                    }
                                >
                                    Nonaktif
                                </DropdownMenuCheckboxItem>
                                {table.getColumn("is_active")?.getFilterValue() !== undefined && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-center text-xs h-8 text-destructive hover:text-destructive"
                                            onClick={() => table.getColumn("is_active")?.setFilterValue(undefined)}
                                        >
                                            Reset Filter
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* EXPORT BUTTON */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 transition-all"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4" />
                        Excel
                    </Button>

                    {/* COLUMN TOGGLE */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 gap-2">
                                <Settings2 className="h-4 w-4" />
                                Tampilan
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Kolom Terlihat</DropdownMenuLabel>
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

            {/* ========================= TABLE CONTENT ========================= */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-12 font-bold text-foreground">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                        className="hover:bg-muted/30 transition-colors border-muted/20"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-muted-foreground animate-pulse"
                                    >
                                        Data tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ========================= PAGINATION ========================= */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm text-muted-foreground">
                    Baris <strong>{table.getRowModel().rows.length}</strong> dari{" "}
                    <strong>{table.getFilteredRowModel().rows.length}</strong> total.
                </div>

                <div className="flex items-center space-x-4 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-xs font-medium whitespace-nowrap">Baris per halaman</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium">
                            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
                        </span>
                        <div className="flex items-center gap-1">
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
        </div>
    )
}