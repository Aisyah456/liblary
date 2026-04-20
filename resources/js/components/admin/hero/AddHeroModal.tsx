import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { route } from "ziggy-js";
import React from 'react';

interface AddHeroModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddHeroModal({ isOpen, onClose }: AddHeroModalProps) {
    // Inisialisasi sesuai skema database hero_sections
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        badge_text: 'Perpustakaan Unggul Terakreditasi A',
        title_line_1: 'Eksplorasi Dunia',
        title_highlight: 'Tanpa Batas.',
        subtitle: '',
        image: null as File | null, // Key 'image' akan diproses controller menjadi 'image_path'
        stats_label: 'Koleksi',
        stats_value: '50k+',
        is_active: true,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Gunakan rute .store karena ini adalah modal TAMBAH data baru
        post(route('admin.hero.store'), {
            forceFormData: true, 
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-160 max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Banner Hero Baru</DialogTitle>
                    <DialogDescription>
                        Konten ini akan muncul di bagian paling atas (Jumbotron) halaman utama.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                    {/* Badge Text */}
                    <div className="grid gap-2">
                        <Label htmlFor="badge_text" className="font-semibold">Teks Badge (Label Kecil)</Label>
                        <Input
                            id="badge_text"
                            value={data.badge_text}
                            onChange={(e) => setData('badge_text', e.target.value)}
                            placeholder="Contoh: Perpustakaan Unggul Terakreditasi A"
                        />
                        {errors.badge_text && <p className="text-xs text-destructive">{errors.badge_text}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title Line 1 */}
                        <div className="grid gap-2">
                            <Label htmlFor="title_line_1" className="font-semibold">Judul Baris 1</Label>
                            <Input
                                id="title_line_1"
                                value={data.title_line_1}
                                onChange={(e) => setData('title_line_1', e.target.value)}
                                placeholder="Eksplorasi Dunia"
                            />
                            {errors.title_line_1 && <p className="text-xs text-destructive">{errors.title_line_1}</p>}
                        </div>
                        {/* Title Highlight */}
                        <div className="grid gap-2">
                            <Label htmlFor="title_highlight" className="font-semibold">Judul Highlight</Label>
                            <Input
                                id="title_highlight"
                                value={data.title_highlight}
                                onChange={(e) => setData('title_highlight', e.target.value)}
                                placeholder="Tanpa Batas."
                            />
                            {errors.title_highlight && <p className="text-xs text-destructive">{errors.title_highlight}</p>}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle" className="font-semibold">Subtitle / Deskripsi</Label>
                        <Textarea
                            id="subtitle"
                            value={data.subtitle}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            placeholder="Tuliskan pesan singkat yang menarik di bawah judul utama..."
                            rows={3}
                        />
                        {errors.subtitle && <p className="text-xs text-destructive">{errors.subtitle}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stats Label */}
                        <div className="grid gap-2">
                            <Label htmlFor="stats_label" className="font-semibold">Label Statistik (Kiri Bawah)</Label>
                            <Input
                                id="stats_label"
                                value={data.stats_label}
                                onChange={(e) => setData('stats_label', e.target.value)}
                                placeholder="Contoh: Koleksi Buku"
                            />
                        </div>
                        {/* Stats Value */}
                        <div className="grid gap-2">
                            <Label htmlFor="stats_value" className="font-semibold">Nilai Statistik</Label>
                            <Input
                                id="stats_value"
                                value={data.stats_value}
                                onChange={(e) => setData('stats_value', e.target.value)}
                                placeholder="Contoh: 50.000+"
                            />
                        </div>
                    </div>

                    {/* Upload Gambar */}
                    <div className="grid gap-2 p-4 border-2 border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                        <Label htmlFor="image" className="font-semibold">Gambar Latar (Background)</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer bg-white dark:bg-zinc-950"
                        />
                        <p className="text-[11px] text-muted-foreground italic">
                            Saran: Gunakan gambar landscape (1920x1080) dengan ukuran maks 2MB.
                        </p>
                        {errors.image && <p className="text-sm font-medium text-destructive">{errors.image}</p>}
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center space-x-3 rounded-md border p-4 shadow-sm">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(v: boolean) => setData('is_active', v)}
                        />
                        <div className="grid gap-1">
                            <Label htmlFor="is_active" className="font-semibold cursor-pointer text-sm">
                                Tampilkan Sekarang
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Jika dinonaktifkan, banner tidak akan muncul di halaman depan.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-30">
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Menyimpan...
                                </span>
                            ) : 'Simpan Banner'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}