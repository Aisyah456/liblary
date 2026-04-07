import { router } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  meta: {
    current_page: number;
    last_page: number;
    path: string;
    per_page: number;
    total: number;
    links: any[];
  };
}

export function PaginationTable({ meta }: Props) {
  // Fungsi untuk mengganti halaman
  const handlePageChange = (url: string | null) => {
    if (url) {
      router.get(url, {}, { preserveScroll: true, preserveState: true });
    }
  };

  // Fungsi untuk mengganti jumlah baris per halaman
  const handleRowsPerPageChange = (value: string) => {
    router.get(
      meta.path,
      { per_page: value },
      { preserveScroll: true, preserveState: true }
    );
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <Label htmlFor="per-page" className="text-sm">Rows per page</Label>
        <Select
          defaultValue={meta.per_page.toString()}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]" id="per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Total {meta.total} data
        </span>
      </div>

      {/* Navigation */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={meta.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              onClick={() => handlePageChange(meta.links[0].url)}
            />
          </PaginationItem>

          <div className="text-sm font-medium px-2">
            Page {meta.current_page} of {meta.last_page}
          </div>

          <PaginationItem>
            <PaginationNext
              className={meta.current_page === meta.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
              onClick={() => handlePageChange(meta.links[meta.links.length - 1].url)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}