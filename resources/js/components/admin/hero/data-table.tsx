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
    searchKey = "title_line_1", // Default disesuaikan ke title_line_1
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
                "Badge Text": item.badge_text,
                "Title Line 1": item.title_line_1,
                "Title Highlight": item.title_highlight,
                "Subtitle": item.subtitle,
                "Path Gambar": item.image_path,
                "Label Statistik": item.stats_label,
                "Nilai Statistik": item.stats_value,
                "Status Aktif": item.is_active ? "Aktif" : "Non-Aktif",
                "Tanggal Dibuat": item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : "-"
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hero Sections");

        // Penyesuaian lebar kolom Excel
        const wscols = [
            { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 40 },
            { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 20 }
        ];
        worksheet["!cols"] = wscols;

        XLSX.writeFile(workbook, `Manajemen_Hero_${new Date().toLocaleDateString('id-ID')}.xlsx`);
    };

    // Filter menggunakan is_active (boolean)
    const currentStatusFilter = table.getColumn("is_active")?.getFilterValue() as string;

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari judul banner..."
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-8 bg-background border-slate-200 focus-visible:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {currentStatusFilter !== undefined && (
                        <Badge variant="secondary" className="h-9 gap-1 px-3 bg-slate-100 text-slate-900 border-slate-200">
                            Status: <span className="font-bold uppercase">
                                {currentStatusFilter === "true" ? "AKTIF" : "NON-AKTIF"}
                            </span>
                            <X
                                className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => table.getColumn("is_active")?.setFilterValue(undefined)}
                            />
                        </Badge>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Status Banner</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { label: 'Aktif', value: 'true' },
                                { label: 'Non-Aktif', value: 'false' },
                            ].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status.value}
                                    checked={currentStatusFilter === status.value}
                                    onCheckedChange={(checked) =>
                                        table.getColumn("is_active")?.setFilterValue(checked ? status.value : undefined)
                                    }
                                >
                                    {status.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        onClick={exportToExcel}
                        disabled={data.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Excel</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Settings2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Tampilan</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-45">
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

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap font-semibold">
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
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3 px-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                        Tidak ada data Banner Hero.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Menampilkan {table.getRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} total data
                </div>

                <div className="flex items-center space-x-2 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                        Hal {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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