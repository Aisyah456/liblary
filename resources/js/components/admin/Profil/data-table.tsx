"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
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

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    searchKey, // Default dilepas dari sini agar pengecekan di bawah lebih akurat
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

    // Helper untuk memastikan searchKey valid
    const activeSearchKey = searchKey && table.getColumn(searchKey) ? searchKey : null;

    /* =========================
        EXPORT EXCEL (IMPROVED)
    ========================== */
    const exportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const original = { ...row.original }
            // Menghapus kolom sistem/aksi agar tidak masuk ke Excel
            const { id, actions, created_at, updated_at, ...cleanedData } = original
            return cleanedData
        })

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
        XLSX.writeFile(workbook, `Export_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    return (
        <div className="w-full space-y-4">
            {/* ========================= HEADER ========================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* SEARCH: Hanya muncul jika searchKey dikirim dan kolomnya ada */}
                <div className="relative flex-1 w-full max-w-sm">
                    {activeSearchKey ? (
                        <>
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Cari berdasarkan ${activeSearchKey.replace("_", " ")}...`}
                                value={(table.getColumn(activeSearchKey)?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn(activeSearchKey)?.setFilterValue(event.target.value)
                                }
                                className="pl-8 h-9"
                            />
                        </>
                    ) : (
                        <div className="h-9" /> // Spacer jika tidak ada search
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* FILTER STATUS (is_active) */}
                    {table.getColumn("is_active") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-2">
                                    <Filter className="h-4 w-4" />
                                    Status
                                    {table.getColumn("is_active")?.getFilterValue() !== undefined && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-primary text-[10px] text-primary-foreground rounded-full">
                                            1
                                        </span>
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
                                            size="sm"
                                            className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                                            onClick={() => table.getColumn("is_active")?.setFilterValue(undefined)}
                                        >
                                            <X className="mr-2 h-3 w-3" />
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
                        className="h-9 gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Settings2 className="h-4 w-4" />
                                Kolom
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
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
                                        {column.id.replace("_", " ")}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ========================= TABLE ========================= */}
            <div className="rounded-md border bg-card shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold whitespace-nowrap">
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
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/30 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    Data tidak ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ========================= PAGINATION ========================= */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Menampilkan <span className="font-medium">{table.getPaginationRowModel().rows.length}</span> dari{" "}
                    <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> baris
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8 order-1 sm:order-2">
                    <div className="flex items-center justify-center text-sm font-medium">
                        Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                        {table.getPageCount()}
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