"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
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
    ChevronFirst,
    ChevronLast,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    exportFileName?: string
}

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    searchKey = "nama_lengkap",
    exportFileName = "Laporan",
}: DataTableProps<TData, TValue>) {
    /* ================= STATE ================= */
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const [loadingExport, setLoadingExport] = React.useState(false)

    /* ================= TABLE CONFIG ================= */
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

    const searchColumn = table.getColumn(searchKey)
    const statusColumn = table.getColumn("status")

    /* ================= EXPORT LOGIC ================= */
    const exportToExcel = React.useCallback(() => {
        const rows = table.getFilteredRowModel().rows
        if (!rows.length) return

        setLoadingExport(true)
        try {
            const exportData = rows.map((row) => {
                const original = row.original
                const filtered: Record<string, any> = {}

                // Blacklist keys
                const excludeKeys = ["id", "updated_at", "created_at", "deleted_at", "password"]

                Object.keys(original).forEach(key => {
                    if (!excludeKeys.includes(key)) {
                        let value = original[key]
                        // Formatting logic
                        if (key === "status") value = String(value).toUpperCase()

                        const cleanKey = key.replace(/_/g, " ").toUpperCase()
                        filtered[cleanKey] = value
                    }
                })
                return filtered
            })

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

            const date = new Date().toLocaleDateString('id-ID').replace(/\//g, '-')
            XLSX.writeFile(workbook, `${exportFileName}_${date}.xlsx`)
        } catch (error) {
            console.error("Gagal export:", error)
        } finally {
            setLoadingExport(false)
        }
    }, [table, exportFileName])

    return (
        <div className="w-full space-y-4">
            {/* ================= TOOLBAR ================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Search Bar */}
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Cari ${searchKey.replace(/_/g, " ")}...`}
                        value={(searchColumn?.getFilterValue() as string) ?? ""}
                        onChange={(e) => searchColumn?.setFilterValue(e.target.value)}
                        className="pl-9 pr-9 h-10 focus-visible:ring-emerald-500"
                    />
                    {searchColumn?.getFilterValue() && (
                        <Button
                            variant="ghost"
                            onClick={() => searchColumn?.setFilterValue("")}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {statusColumn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-2 border-dashed">
                                    <Filter className="h-4 w-4" />
                                    Status
                                    {statusColumn.getFilterValue() && (
                                        <Badge className="ml-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                            {String(statusColumn.getFilterValue())}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {["pending", "selesai"].map((s) => (
                                    <DropdownMenuCheckboxItem
                                        key={s}
                                        className="capitalize"
                                        checked={statusColumn.getFilterValue() === s}
                                        onCheckedChange={(v) => statusColumn.setFilterValue(v ? s : undefined)}
                                    >
                                        {s}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={exportToExcel}
                        disabled={loadingExport || data.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        {loadingExport ? "Exporting..." : "Excel"}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 gap-2">
                                <Settings2 className="h-4 w-4" />
                                Kolom
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns()
                                .filter(col => col.getCanHide())
                                .map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        className="capitalize"
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                                    >
                                        {col.id.replace(/_/g, " ")}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ================= TABLE BODY ================= */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
                                    <TableHead key={header.id} className="font-bold text-slate-700">
                                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                        Total {table.getFilteredRowModel().rows.length} data
                    </span>
                    <div className="flex items-center gap-2">
                        <p className="hidden sm:block">Baris per halaman:</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(v) => table.setPageSize(Number(v))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50, 100].map((size) => (
                                    <SelectItem key={size} value={`${size}`}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                        Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronLast className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}