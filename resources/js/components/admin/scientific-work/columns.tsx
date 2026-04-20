import type { ColumnDef } from "@tanstack/react-table";

export type ScientificWork = {
    id: number;
    [key: string]: unknown;
};

export const columns = (): ColumnDef<ScientificWork>[] => [];