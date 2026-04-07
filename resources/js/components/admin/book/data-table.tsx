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
import { Plus, Search, Settings2, Download } from "lucide-react" // Tambah icon Download
import * as React from "react"

import * as XLSX from "xlsx" // Import library Excel
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
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
    onAddClick?: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAddClick,
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

    // --- FUNGSI EXPORT EXCEL ---
    const exportToExcel = () => {
        // Mengambil data yang sedang tampil (sudah ter-filter/sort)
        const visibleRows = table.getFilteredRowModel().rows.map((row) => {
            return row.getVisibleCells().reduce((acc: any, cell) => {
                const header = cell.column.columnDef.header as string
                // Abaikan kolom aksi jika ada (biasanya kolom tanpa header string)
                if (typeof header === 'string') {
                    acc[header] = cell.getValue()
                }
                return acc
            }, {})
        })

        const worksheet = XLSX.utils.json_to_sheet(visibleRows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Koleksi Buku")

        // Download file
        XLSX.writeFile(workbook, `Data_Buku_${new Date().toLocaleDateString()}.xlsx`)
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-center py-4 gap-3">
                {/* Search Filter Berdasarkan Judul */}
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari judul buku..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                {/* Filter Tambahan (Contoh: Berdasarkan Status) */}
                {table.getColumn("status") && (
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="Tersedia">Tersedia</option>
                        <option value="Dipinjam">Dipinjam</option>
                    </select>
                )}

                <div className="ml-auto flex flex-wrap gap-2">
                    {/* Tombol Export */}
                    <Button
                        variant="outline"
                        onClick={exportToExcel}
                        className="flex gap-2 text-green-700 border-green-200 hover:bg-green-50"
                    >
                        <Download className="h-4 w-4" /> Export Excel
                    </Button>

                    {onAddClick && (
                        <Button onClick={onAddClick} className="flex gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4" /> Tambah Koleksi Buku
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <Settings2 className="h-4 w-4" /> Tampilan
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
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
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-slate-700">
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
                                    className="hover:bg-slate-50/50 transition-colors"
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
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Data buku tidak ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination ... (tetap sama seperti sebelumnya) */}
        </div>
    )
}