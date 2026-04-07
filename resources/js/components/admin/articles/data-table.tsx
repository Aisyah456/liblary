"use client"

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
    X
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

        filterFns: {
            equals: (row, columnId, value) => {
                return row.getValue(columnId) === value
            },
        },

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    /* EXPORT */
    const exportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const item = { ...row.original }
            delete item.content
            delete item.thumbnail
            return item
        })

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Articles")
        XLSX.writeFile(wb, "articles.xlsx")
    }

    return (
        <div className="w-full space-y-4">

            {/* HEADER */}
            <div className="flex justify-between gap-4 flex-wrap">

                {/* SEARCH */}
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-8"
                        placeholder="Cari artikel..."
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(e) =>
                            table.getColumn(searchKey)?.setFilterValue(e.target.value)
                        }
                    />
                </div>

                <div className="flex gap-2">

                    {/* FILTER FEATURED */}
                    {table.getColumn("is_featured") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-1" />
                                    Featured
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuCheckboxItem
                                    checked={table.getColumn("is_featured")?.getFilterValue() === true}
                                    onCheckedChange={() =>
                                        table.getColumn("is_featured")?.setFilterValue(true)
                                    }
                                >
                                    Featured
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuCheckboxItem
                                    checked={table.getColumn("is_featured")?.getFilterValue() === false}
                                    onCheckedChange={() =>
                                        table.getColumn("is_featured")?.setFilterValue(false)
                                    }
                                >
                                    Normal
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuSeparator />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        table.getColumn("is_featured")?.setFilterValue(undefined)
                                    }
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Reset
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* EXPORT */}
                    <Button onClick={exportToExcel} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id}>
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-32">
                                    Data tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end gap-2">
                <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <ChevronLeft />
                </Button>
                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}