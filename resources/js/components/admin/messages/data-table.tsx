"use client"

import * as React from "react"
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState
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
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
}

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    searchKey = "nama_lengkap",
}: DataTableProps<TData, TValue>) {

    /* ================= STATE ================= */
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const [loadingExport, setLoadingExport] = React.useState(false)

    /* ================= TABLE ================= */
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

    /* ================= SAFE COLUMN ================= */
    const searchColumn = table.getColumn(searchKey)
    const statusColumn = table.getColumn("status")

    /* ================= EXPORT EXCEL ================= */
    const exportToExcel = React.useCallback(() => {
        if (!table.getFilteredRowModel().rows.length) {
            alert("Tidak ada data untuk diexport!")
            return
        }

        setLoadingExport(true)

        setTimeout(() => {
            const exportData = table.getFilteredRowModel().rows.map((row) => {
                const original = row.original || {}
                const { id, updated_at, ...rest } = original

                if (rest.status) {
                    rest.status = rest.status === "selesai" ? "Selesai" : "Pending"
                }

                return rest
            })

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

            const dateStr = new Date().toLocaleDateString("id-ID").replace(/\//g, "-")
            XLSX.writeFile(workbook, `Laporan_${dateStr}.xlsx`)

            setLoadingExport(false)
        }, 300)
    }, [table])

    return (
        <div className="w-full space-y-4">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* SEARCH */}
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Cari ${searchKey.replace(/_/g, " ")}...`}
                        value={(searchColumn?.getFilterValue() as string) ?? ""}
                        onChange={(e) => searchColumn?.setFilterValue(e.target.value)}
                        className="pl-9 h-10"
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

                {/* ACTION */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* FILTER STATUS */}
                    {statusColumn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-dashed">
                                    <Filter className="h-4 w-4" />
                                    Status
                                    {statusColumn.getFilterValue() && (
                                        <Badge variant="secondary" className="ml-1 text-[10px]">1</Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuCheckboxItem
                                    checked={statusColumn.getFilterValue() === "pending"}
                                    onCheckedChange={(v) =>
                                        statusColumn.setFilterValue(v ? "pending" : undefined)
                                    }
                                >
                                    Pending
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuCheckboxItem
                                    checked={statusColumn.getFilterValue() === "selesai"}
                                    onCheckedChange={(v) =>
                                        statusColumn.setFilterValue(v ? "selesai" : undefined)
                                    }
                                >
                                    Selesai
                                </DropdownMenuCheckboxItem>

                                {statusColumn.getFilterValue() && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            className="w-full text-xs"
                                            onClick={() => statusColumn.setFilterValue(undefined)}
                                        >
                                            Reset
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* EXPORT */}
                    <Button
                        onClick={exportToExcel}
                        disabled={loadingExport}
                        className="gap-2 text-emerald-600 border border-emerald-200"
                        variant="outline"
                    >
                        <Download className="h-4 w-4" />
                        {loadingExport ? "Exporting..." : "Excel"}
                    </Button>

                    {/* COLUMN VISIBILITY */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Settings2 className="h-4 w-4" />
                                Tampilan
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Kolom</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {table.getAllColumns()
                                .filter(col => col.getCanHide())
                                .map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                                    >
                                        {col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    Data tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-between items-center">
                <div className="text-sm">
                    {table.getFilteredRowModel().rows.length} data
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft />
                    </Button>

                    <span className="text-sm">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
                    </span>

                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}