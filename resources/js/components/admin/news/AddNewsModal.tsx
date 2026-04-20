import { useForm } from '@inertiajs/react';
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

interface AddNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function formatDateTimeLocal(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddNewsModal({ isOpen, onClose }: AddNewsModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: '',
        excerpt: '',
        body: '',
        thumbnail: null as File | null,
        published_at: formatDateTimeLocal(new Date()),
        is_published: false,
        is_featured: false,
    });

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            clearErrors();
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.news.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Berita</DialogTitle>
                    <DialogDescription>Buat entri berita baru untuk halaman publik.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="add-title">Judul *</Label>
                        <Input
                            id="add-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-category">Kategori</Label>
                        <Input
                            id="add-category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="Contoh: Pengumuman"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-excerpt">Ringkasan</Label>
                        <Textarea
                            id="add-excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-body">Isi *</Label>
                        <Textarea
                            id="add-body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={6}
                            required
                        />
                        {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-thumb">Gambar (opsional)</Label>
                        <Input
                            id="add-thumb"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('thumbnail', e.target.files?.[0] ?? null)}
                        />
                        {errors.thumbnail && <p className="text-xs text-destructive">{errors.thumbnail}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-published">Tanggal publikasi</Label>
                        <Input
                            id="add-published"
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="add-published-sw"
                                checked={data.is_published}
                                onCheckedChange={(v) => setData('is_published', v)}
                            />
                            <Label htmlFor="add-published-sw">Publikasikan</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="add-featured"
                                checked={data.is_featured}
                                onCheckedChange={(v) => setData('is_featured', v)}
                            />
                            <Label htmlFor="add-featured">Unggulan</Label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
