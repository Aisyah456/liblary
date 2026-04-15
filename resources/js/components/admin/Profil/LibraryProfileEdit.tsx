import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2, Info, Eye, Clock, BarChart3, ListPlus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface LibraryProfile {
    id: number;
    about_title: string;
    about_description: string;
    vision: string;
    mission: string | string[]; // Backend bisa mengirim JSON string atau Array
    total_books: number;
    total_staff: number;
    service_hours_weekday: string;
    service_hours_weekend: string;
}

interface Props {
    profile: LibraryProfile;
}

export default function LibraryProfileEdit({ profile }: Props) {
    // Helper untuk memastikan mission adalah array string
    const parseMission = (missionData: any): string[] => {
        if (Array.isArray(missionData)) return missionData;
        try {
            const parsed = JSON.parse(missionData);
            return Array.isArray(parsed) ? parsed : [''];
        } catch {
            return [''];
        }
    };

    const { data, setData, put, processing, errors, reset } = useForm({
        about_title: profile.about_title || '',
        about_description: profile.about_description || '',
        vision: profile.vision || '',
        mission: parseMission(profile.mission),
        total_books: profile.total_books || 0,
        total_staff: profile.total_staff || 0,
        service_hours_weekday: profile.service_hours_weekday || '',
        service_hours_weekend: profile.service_hours_weekend || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Profil Perpustakaan', href: route('admin.profile.index') },
        { title: `Edit Profil`, href: '#' },
    ];

    const handleAddMission = () => setData('mission', [...data.mission, '']);

    const handleRemoveMission = (index: number) => {
        if (data.mission.length > 1) {
            setData('mission', data.mission.filter((_, i) => i !== index));
        }
    };

    const handleMissionChange = (index: number, value: string) => {
        const newMission = [...data.mission];
        newMission[index] = value;
        setData('mission', newMission);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.profile.update', profile.id), {
            onSuccess: () => toast.success('Profil berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui profil'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil Perpustakaan" />
            <div className="p-4 md:p-8">
                <form onSubmit={submit} className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => router.get(route('admin.profile.index'))}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Edit Profil</h1>
                                <p className="text-muted-foreground text-sm">Perbarui informasi operasional perpustakaan.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button type="button" variant="ghost" onClick={() => reset()} disabled={processing}>
                                Reset
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-2">
                                <Save className="h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card Tentang Kami */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tentang Kami</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="about_title">Judul Profil</Label>
                                        <Input
                                            id="about_title"
                                            value={data.about_title}
                                            onChange={e => setData('about_title', e.target.value)}
                                        />
                                        {errors.about_title && <p className="text-red-500 text-xs">{errors.about_title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="about_description">Deskripsi</Label>
                                        <Textarea
                                            id="about_description"
                                            rows={5}
                                            value={data.about_description}
                                            onChange={e => setData('about_description', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Visi Misi */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visi & Misi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vision">Visi</Label>
                                        <Textarea
                                            id="vision"
                                            value={data.vision}
                                            onChange={e => setData('vision', e.target.value)}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Misi</Label>
                                            <Button type="button" variant="outline" size="sm" onClick={handleAddMission}>
                                                <ListPlus className="h-4 w-4 mr-1" /> Tambah Misi
                                            </Button>
                                        </div>
                                        {data.mission.map((m, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={m}
                                                    onChange={e => handleMissionChange(index, e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveMission(index)}
                                                    disabled={data.mission.length <= 1}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar: Kapasitas & Jam */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Kapasitas</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Total Buku</Label>
                                        <Input type="number" value={data.total_books} onChange={e => setData('total_books', parseInt(e.target.value) || 0)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Staff</Label>
                                        <Input type="number" value={data.total_staff} onChange={e => setData('total_staff', parseInt(e.target.value) || 0)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle className="text-sm">Jam Layanan</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Weekday</Label>
                                        <Input value={data.service_hours_weekday} onChange={e => setData('service_hours_weekday', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weekend</Label>
                                        <Input value={data.service_hours_weekend} onChange={e => setData('service_hours_weekend', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}