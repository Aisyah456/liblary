import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Interface untuk tipe data props dari Laravel
interface DashboardProps {
    stats: {
        total_turnitin: number;
        pending_bebas_pustaka: number;
        approved_bebas_pustaka: number;
    };
    recent_submissions: any[];
}

export default function Dashboard({ stats, recent_submissions }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Section 1: Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Card Turnitin */}
                    <div className="flex flex-col justify-between p-6 rounded-xl border border-sidebar-border bg-card shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Turnitin</h3>
                            <FileText className="size-4 text-blue-500" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{stats?.total_turnitin ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Dokumen masuk</p>
                        </div>
                    </div>

                    {/* Card Pending Bebas Pustaka */}
                    <div className="flex flex-col justify-between p-6 rounded-xl border border-sidebar-border bg-card shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Menunggu Verifikasi</h3>
                            <Clock className="size-4 text-yellow-500" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{stats?.pending_bebas_pustaka ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Bebas Pustaka</p>
                        </div>
                    </div>

                    {/* Card Approved */}
                    <div className="flex flex-col justify-between p-6 rounded-xl border border-sidebar-border bg-card shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Disetujui</h3>
                            <CheckCircle className="size-4 text-green-500" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{stats?.approved_bebas_pustaka ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Sertifikat terbit</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Table Activity */}
                {/* <div className="flex-1 overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold tracking-tight">Aktivitas Terakhir</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Nama Mahasiswa</th>
                                    <th className="px-4 py-3 font-medium">NIM</th>
                                    <th className="px-4 py-3 font-medium">Turnitin %</th>
                                    <th className="px-4 py-3 font-medium">Status Pustaka</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t">
                                {recent_submissions?.length > 0 ? (
                                    recent_submissions.map((item, index) => (
                                        <tr key={index} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">{item.full_name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{item.nim}</td>
                                            <td className="px-4 py-3">
                                                <span className={`font-bold ${item.turnitin_similarity_score > 25 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {item.turnitin_similarity_score ?? '-'} %
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            Belum ada data pengajuan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>
        </AppLayout>
    );
}