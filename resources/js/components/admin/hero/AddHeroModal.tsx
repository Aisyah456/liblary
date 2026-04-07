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
        image: null as File | null, // Untuk upload image_path
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
        // Menggunakan rute hero (sesuaikan dengan rute Laravel Anda)
        post(route('Hero.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Banner Hero</DialogTitle>
                    <DialogDescription>
                        Konfigurasi tampilan utama (banner) halaman depan perpustakaan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Badge Text */}
                    <div className="grid gap-2">
                        <Label htmlFor="badge_text">Teks Badge (Label Kecil)</Label>
                        <Input
                            id="badge_text"
                            value={data.badge_text}
                            onChange={(e) => setData('badge_text', e.target.value)}
                            placeholder="Contoh: Terakreditasi A"
                        />
                        {errors.badge_text && <p className="text-xs text-destructive">{errors.badge_text}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Title Line 1 */}
                        <div className="grid gap-2">
                            <Label htmlFor="title_line_1">Judul Utama</Label>
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
                            <Label htmlFor="title_highlight">Judul Highlight (Warna Berbeda)</Label>
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
                        <Label htmlFor="subtitle">Sub-Judul / Deskripsi *</Label>
                        <Textarea
                            id="subtitle"
                            value={data.subtitle}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            placeholder="Tuliskan deskripsi singkat banner..."
                            rows={3}
                        />
                        {errors.subtitle && <p className="text-xs text-destructive">{errors.subtitle}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Stats Label */}
                        <div className="grid gap-2">
                            <Label htmlFor="stats_label">Label Statistik</Label>
                            <Input
                                id="stats_label"
                                value={data.stats_label}
                                onChange={(e) => setData('stats_label', e.target.value)}
                                placeholder="Contoh: Koleksi"
                            />
                        </div>
                        {/* Stats Value */}
                        <div className="grid gap-2">
                            <Label htmlFor="stats_value">Nilai Statistik</Label>
                            <Input
                                id="stats_value"
                                value={data.stats_value}
                                onChange={(e) => setData('stats_value', e.target.value)}
                                placeholder="Contoh: 50k+"
                            />
                        </div>
                    </div>

                    {/* Upload Gambar */}
                    <div className="grid gap-2">
                        <Label htmlFor="image">Gambar Background *</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Recomended: 1920x1080 px</p>
                        {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center gap-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(v: boolean) => setData('is_active', v)}
                        />
                        <Label htmlFor="is_active">Aktifkan Banner Ini</Label>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Banner'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}