import { Head, useForm, router } from '@inertiajs/react';
import { Edit3, Trash2, Plus, Info, Clock, BookOpen, Users } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Pastikan path ini benar dan komponen ini menerima props 'open' dan 'onOpenChange'
import EditProfilModal from '@/components/admin/Profil/LibraryProfileEdit';

import type { BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
import LibraryFreeController from '@/actions/App/Http/Controllers/LibraryFreeController';

interface LibraryProfile {
    id: number;
    about_title: string;
    about_description: string;
    vision: string;
    mission: string | string[];
    total_books: number;
    total_staff: number;
    service_hours_weekday: string;
    service_hours_weekend: string;
}

interface Props {
    profiles?: LibraryProfile[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profil Perpustakaan', href: LibraryFreeController.index().url }];

export default function LibraryProfileCRUD({ profiles = [] }: Props) {
    const { delete: destroy } = useForm();

    // State untuk mengontrol Modal Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<LibraryProfile | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data profil ini?')) {
            destroy(route('admin.profile.destroy', id), {
                onSuccess: () => toast.success('Data berhasil dihapus'),
                onError: () => toast.error('Gagal menghapus data'),
            });
        }
    };

    const handleEditClick = (profile: LibraryProfile) => {
        router.get(route('admin.profile.edit', profile.id)); 
    };

    const renderMissionCount = (mission: string | string[]) => {
        try {
            const parsed = typeof mission === 'string' ? JSON.parse(mission) : mission;
            return Array.isArray(parsed) ? parsed.length : 0;
        } catch (e) {
            // Jika mission sudah berupa array karena casting di backend
            return Array.isArray(mission) ? mission.length : 0;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Profil" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Manajemen Profil</h2>
                        <p className="text-muted-foreground">
                            Konfigurasi informasi publik dan operasional perpustakaan.
                        </p>
                    </div>

                    {/* Hanya tampilkan tombol tambah jika profil masih kosong */}
                    {profiles.length === 0 && (
                        <Button
                            onClick={() => router.get(route('admin.profile.create'))}
                            className="w-full sm:w-auto gap-2"
                        >
                            <Plus className="h-4 w-4" /> Tambah Profil Baru
                        </Button>
                    )}
                </div>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Daftar Profil</CardTitle>
                        <CardDescription>Menampilkan informasi profil perpustakaan Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="py-4 pl-6 font-semibold">Informasi Dasar</TableHead>
                                    <TableHead className="font-semibold">Visi & Misi</TableHead>
                                    <TableHead className="font-semibold text-center">Kapasitas</TableHead>
                                    <TableHead className="font-semibold">Jam Layanan</TableHead>
                                    <TableHead className="pr-6 text-right font-semibold">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profiles.length > 0 ? (
                                    profiles.map((item) => (
                                        <TableRow key={item.id} className="group transition-colors hover:bg-muted/20">
                                            <TableCell className="py-5 pl-6 align-top">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-bold text-foreground underline-offset-4 group-hover:underline">
                                                        {item.about_title}
                                                    </span>
                                                    <span className="max-w-75 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                                        {item.about_description}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="align-top py-5">
                                                <div className="flex flex-col gap-2">
                                                    <p className="max-w-50 text-sm italic text-foreground/80 line-clamp-1">
                                                        "{item.vision}"
                                                    </p>
                                                    <Badge variant="secondary" className="w-fit font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                        {renderMissionCount(item.mission)} Misi Terdaftar
                                                    </Badge>
                                                </div>
                                            </TableCell>

                                            <TableCell className="align-top py-5">
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 w-24 justify-center">
                                                        <BookOpen className="h-3 w-3" />
                                                        {item.total_books.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 w-24 justify-center">
                                                        <Users className="h-3 w-3" />
                                                        {item.total_staff} Staff
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="align-top py-5">
                                                <div className="flex flex-col gap-1 text-[13px]">
                                                    <div className="flex items-center gap-2 font-medium text-amber-700">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{item.service_hours_weekday}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground ml-5 text-xs">
                                                        <span>{item.service_hours_weekend}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="pr-6 text-right py-5 align-top">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditClick(item)}
                                                        className="h-9 w-9 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="mx-auto flex max-w-105 flex-col items-center justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                    <Info className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="mt-4 text-lg font-semibold">Belum Ada Data</h3>
                                                <p className="mb-4 mt-2 text-sm text-muted-foreground text-center">
                                                    Data profil perpustakaan belum tersedia. Silakan buat profil pertama Anda.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}