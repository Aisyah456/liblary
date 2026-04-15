import { Head } from '@inertiajs/react';
import {
    Plus, FileSearch, Download,
    Clock, Loader2, AlertCircle
} from "lucide-react";
import { useEffect, useState, useMemo } from 'react';

// Components
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from '@/components/admin/turnitinProcess/data-table';
import { columns } from "@/components/admin/turnitinProcess/columns";
import AddSubmissionModal from '@/components/admin/turnitinProcess/AddSubmissionModal';
import ProcessTurnitinModal from '@/components/admin/turnitinProcess/ProcessTurnitinModal';

/* =========================
    TYPES
========================= */
export interface TurnitinSubmission {
    id: number;
    identifier_id: string;
    full_name: string;
    email: string;
    faculty_id: number;
    major_id: number;
    title: string;
    document_type: string;
    file_path: string;
    academic_year: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    similarity_percentage: number | null;
    result_file_path: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string; // Tambahkan ini
    major?: { id: number; name: string; };
    faculty?: { id: number; name: string; };

    // Virtual property untuk sinkronisasi modal
    result?: {
        similarity_percentage?: number;
        check_date?: string;
        librarian_notes?: string;
        verdict?: string;
    };
}

interface Props {
    submissions: TurnitinSubmission[];
    faculties: any[];
}

const BREADCRUMBS = [{ title: 'Turnitin Process', href: '#' }];

export default function TurnitinProcess({ submissions = [], faculties }: Props) {
    const [data, setData] = useState<TurnitinSubmission[]>(submissions);
    const [selectedSubmission, setSelectedSubmission] = useState<TurnitinSubmission | null>(null);
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Update internal state jika props dari Inertia berubah
    useEffect(() => {
        setData(Array.isArray(submissions) ? submissions : []);
    }, [submissions]);

    // Menghitung statistik berdasarkan data terbaru
    const stats = useMemo(() => [
        { label: 'Total Antrean', value: data.length, icon: FileSearch, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending', value: data.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Proses', value: data.filter(s => s.status === 'processing').length, icon: Loader2, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Selesai', value: data.filter(s => s.status === 'completed').length, icon: AlertCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ], [data]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Turnitin" />

            <div className="flex flex-col gap-8 p-6 lg:p-8 bg-slate-50/30 min-h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">
                            Turnitin <span className="text-teal-600 font-extrabold not-italic">Hub</span>
                        </h1>
                        <p className="text-slate-500 text-sm max-w-2xl font-medium">
                            Monitoring orisinalitas dokumen untuk ID: <span className="text-slate-800">NIM/NIDN Mahasiswa & Dosen</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200">
                            <Download className="w-4 h-4 mr-2" /> Export Log
                        </Button>
                        <Button onClick={() => setAddModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20">
                            <Plus className="w-4 h-4 mr-2" /> Pengajuan Baru
                        </Button>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="group border-none shadow-sm ring-1 ring-slate-200 hover:ring-teal-500/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.label === 'Proses' ? 'animate-spin' : ''}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                                <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Sistem Cloud Turnitin</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Antrean Verifikasi
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Real-time</span>
                        </h2>
                    </div>

                    <main className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-4">
                            <DataTable
                                /* PERBAIKAN DI SINI: Mengirimkan dua setter sesuai kebutuhan columns.tsx */
                                columns={columns(setProcessModalOpen, setSelectedSubmission)}
                                data={data}
                                searchKey="full_name"
                            />
                        </div>
                    </main>
                </section>
            </div>

            {/* MODAL ADD */}
            <AddSubmissionModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                faculties={faculties}
            />

            {/* MODAL PROCESS */}
            <ProcessTurnitinModal
                isOpen={processModalOpen}
                submission={selectedSubmission}
                onClose={() => {
                    setProcessModalOpen(false);
                    setSelectedSubmission(null);
                }}
            />
        </AppLayout>
    );
}