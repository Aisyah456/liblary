import React, { useEffect } from 'react'; // Tambahkan useEffect
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
import NewsRoute from '@/routes/news';
import { NewsRow } from './columns'; // Pastikan import type ini ada

interface EditNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    news: NewsRow | null; // Tambahkan news ke props
}

// Helper untuk format tanggal agar sesuai dengan input datetime-local
function formatDateTime(dateStr: string | null) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
}

export default function EditNewsModal({ isOpen, onClose, news }: EditNewsModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'put', // Laravel spoofing untuk update dengan file
        title: '',
        category: '',
        excerpt: '',
        body: '',
        thumbnail: null as File | string | null,
        published_at: '',
        is_published: false,
        is_featured: false,
    });

    // Sinkronisasi data saat modal dibuka atau news berubah
    useEffect(() => {
        if (isOpen && news) {
            setData({
                _method: 'put',
                title: news.title ?? '',
                category: news.category ?? '',
                excerpt: news.excerpt ?? '',
                body: news.body ?? '',
                thumbnail: news.thumbnail, // Tetap string jika tidak diubah
                published_at: formatDateTime(news.published_at),
                is_published: !!news.is_published,
                is_featured: !!news.is_featured,
            });
        }
    }, [isOpen, news]);

    const handleClose = () => {
        onClose();
        // Reset form setelah transisi tutup selesai agar tidak terlihat "berkedip"
        setTimeout(() => {
            reset();
            clearErrors();
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!news) return;

        // Gunakan post dengan _method put karena mengirim File
        post((NewsRoute as any).update.url(news.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Berita</DialogTitle>
                    <DialogDescription>
                        Ubah detail berita di bawah ini. Slug akan diperbarui jika judul diubah.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Judul berita"
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="Contoh: Pengumuman"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Ringkasan (excerpt)</Label>
                        <Textarea
                            id="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            placeholder="Teks singkat..."
                            rows={2}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body">Isi Berita *</Label>
                        <Textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={6}
                            required
                        />
                        {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Upload Gambar Baru (Opsional)</Label>
                        {typeof data.thumbnail === 'string' && data.thumbnail && (
                            <p className="text-[10px] text-muted-foreground">File saat ini: {data.thumbnail.split('/').pop()}</p>
                        )}
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('thumbnail', e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer"
                        />
                        {errors.thumbnail && <p className="text-xs text-destructive">{errors.thumbnail}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="published_at">Tanggal Publikasi</Label>
                        <Input
                            id="published_at"
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_published"
                                checked={data.is_published}
                                onCheckedChange={(v) => setData('is_published', v)}
                            />
                            <Label htmlFor="is_published">Publikasikan</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_featured"
                                checked={data.is_featured}
                                onCheckedChange={(v) => setData('is_featured', v)}
                            />
                            <Label htmlFor="is_featured">Unggulan</Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 gap-2">
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