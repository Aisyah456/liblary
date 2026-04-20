import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
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
import type { HeroRow } from "@/pages/admin/cms/Hero";

interface EditHeroModalProps {
    isOpen: boolean;
    onClose: () => void;
    hero: HeroRow | null;
}

export default function EditHeroModal({ isOpen, onClose, hero }: EditHeroModalProps) {
    // 1. Definisikan form
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id: null as number | string | null,
        _method: 'put', // Penting untuk update data yang berisi file di Laravel
        badge_text: '',
        title_line_1: '',
        title_highlight: '',
        subtitle: '',
        image: null as File | string | null,
        stats_label: '',
        stats_value: '',
        is_active: true,
    });

    // 2. Sinkronisasi data saat modal dibuka
    useEffect(() => {
        if (isOpen && hero) {
            setData({
                id: hero.id,
                _method: 'put',
                badge_text: hero.badge_text ?? '',
                title_line_1: hero.title_line_1 ?? '',
                title_highlight: hero.title_highlight ?? '',
                subtitle: hero.subtitle ?? '',
                image: null, // Jangan masukkan string path ke state image file saat edit
                stats_label: hero.stats_label ?? '',
                stats_value: hero.stats_value ?? '',
                is_active: !!hero.is_active,
            });
        }
    }, [isOpen, hero]);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            clearErrors();
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hero) return;


        post(route('admin.hero.update', hero.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onError: (err) => console.error("Simpan gagal:", err)
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-160 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Banner Hero</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi teks, gambar, dan statistik untuk banner utama.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Badge Text */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-badge">Teks Badge</Label>
                        <Input
                            id="edit-badge"
                            value={data.badge_text}
                            onChange={(e) => setData('badge_text', e.target.value)}
                            placeholder="Contoh: Terakreditasi A"
                        />
                        {errors.badge_text && <p className="text-sm text-red-500">{errors.badge_text}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title1">Judul Utama</Label>
                            <Input
                                id="edit-title1"
                                value={data.title_line_1}
                                onChange={(e) => setData('title_line_1', e.target.value)}
                                required
                            />
                            {errors.title_line_1 && <p className="text-sm text-red-500">{errors.title_line_1}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-highlight">Highlight</Label>
                            <Input
                                id="edit-highlight"
                                value={data.title_highlight}
                                onChange={(e) => setData('title_highlight', e.target.value)}
                                required
                            />
                            {errors.title_highlight && <p className="text-sm text-red-500">{errors.title_highlight}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-subtitle">Subtitle / Deskripsi</Label>
                        <Textarea
                            id="edit-subtitle"
                            value={data.subtitle}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            rows={3}
                            required
                        />
                        {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-stats-label">Label Statistik</Label>
                            <Input
                                id="edit-stats-label"
                                value={data.stats_label}
                                onChange={(e) => setData('stats_label', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-stats-value">Nilai Statistik</Label>
                            <Input
                                id="edit-stats-value"
                                value={data.stats_value}
                                onChange={(e) => setData('stats_value', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-image">Upload Gambar Baru</Label>
                        {/* Menampilkan info jika ada gambar lama */}
                        {hero?.image_path && (
                            <p className="text-[10px] text-muted-foreground">
                                File aktif: {hero.image_path.split('/').pop()}
                            </p>
                        )}
                        <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Biarkan kosong jika tidak ingin mengubah gambar.</p>
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                    </div>

                    <div className="flex items-center gap-2 border-t pt-4">
                        <Switch
                            id="edit-is_active"
                            checked={data.is_active}
                            onCheckedChange={(v) => setData('is_active', v)}
                        />
                        <Label htmlFor="edit-is_active">Banner Aktif</Label>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}