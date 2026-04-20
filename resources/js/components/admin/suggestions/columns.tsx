import type { ColumnDef } from "@tanstack/react-table";

export type BookSuggestion = {
    id: number;
};

export const columns = (
    _setEditModalOpen: (open: boolean) => void,
    _setSelectedSuggestion: (suggestion: any) => void,
): ColumnDef<BookSuggestion>[] => [];
