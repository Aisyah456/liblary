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
    searchKey = "title",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
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
        EXPORT EXCEL (GENERIC)
    ========================== */
    const exportToExcel = () => {
        const exportData = table
            .getFilteredRowModel()
            .rows.map((row) => row.original)

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
        XLSX.writeFile(workbook, "Data_Table.xlsx")
    }

    return (
        <div className="w-full space-y-4">
            {/* ========================= HEADER ========================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* SEARCH */}
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari data..."
                        value={
                            (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* FILTER STATUS BOOLEAN */}
                    {table.getColumn("is_active") && (
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

                                <DropdownMenuCheckboxItem
                                    checked={
                                        table.getColumn("is_active")?.getFilterValue() === true
                                    }
                                    onCheckedChange={() =>
                                        table.getColumn("is_active")?.setFilterValue(true)
                                    }
                                >
                                    Aktif
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuCheckboxItem
                                    checked={
                                        table.getColumn("is_active")?.getFilterValue() === false
                                    }
                                    onCheckedChange={() =>
                                        table.getColumn("is_active")?.setFilterValue(false)
                                    }
                                >
                                    Nonaktif
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuSeparator />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start font-normal"
                                    onClick={() =>
                                        table.getColumn("is_active")?.setFilterValue(undefined)
                                    }
                                >
                                    Reset Filter
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* EXPORT */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 text-green-700 border-green-200 hover:bg-green-50"
                        onClick={exportToExcel}
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>

                    {/* TOGGLE COLUMN */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
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
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace("_", " ")}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ========================= TABLE ========================= */}
            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                    {table.getFilteredRowModel().rows.length} baris dipilih.
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
    )
}
