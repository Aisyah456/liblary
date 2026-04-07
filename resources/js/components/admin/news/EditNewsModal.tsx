import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
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
import type { NewsRow } from './columns';

interface EditNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    news: NewsRow | null;
}

function formatDateTimeForInput(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    // Format: YYYY-MM-DDTHH:mm
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditNewsModal({ isOpen, onClose, news }: EditNewsModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'put', // Method spoofing untuk Laravel
        title: '',
        category: '',
        excerpt: '',
        body: '',
        thumbnail: null as File | null, // Set null, jangan isi string URL di sini
        published_at: '',
        is_published: false,
        is_featured: false,
    });

    useEffect(() => {
        if (isOpen && news) {
            setData({
                _method: 'put',
                title: news.title ?? '',
                category: news.category ?? '',
                excerpt: news.excerpt ?? '',
                body: news.body ?? '',
                thumbnail: null, // Tetap null agar tidak memvalidasi string URL sebagai file
                published_at: formatDateTimeForInput(news.published_at),
                is_published: !!news.is_published,
                is_featured: !!news.is_featured,
            });
        }
    }, [isOpen, news]);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            clearErrors();
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!news) return;

        post(NewsRoute.update(news.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onError: (err) => {
                console.error("Update Error:", err);
                // Cek console log ini untuk melihat detail error validasi dari Laravel
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Berita</DialogTitle>
                    <DialogDescription>
                        Ubah detail berita. Biarkan gambar kosong jika tidak ingin mengganti.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title">Judul *</Label>
                        <Input
                            id="edit-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-category">Kategori</Label>
                        <Input
                            id="edit-category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-body">Isi Berita *</Label>
                        <Textarea
                            id="edit-body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={6}
                            required
                        />
                        {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-thumbnail">Ganti Gambar (Opsional)</Label>
                        {news?.thumbnail && !data.thumbnail && (
                            <p className="text-[10px] text-muted-foreground italic">
                                File aktif: {news.thumbnail.split('/').pop()}
                            </p>
                        )}
                        <Input
                            id="edit-thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('thumbnail', e.target.files ? e.target.files[0] : null)}
                        />
                        {errors.thumbnail && <p className="text-xs text-destructive">{errors.thumbnail}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-published_at">Tanggal Publikasi</Label>
                        <Input
                            id="edit-published_at"
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-6 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="edit-is_published"
                                checked={data.is_published}
                                onCheckedChange={(v) => setData('is_published', v)}
                            />
                            <Label htmlFor="edit-is_published">Publish</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="edit-is_featured"
                                checked={data.is_featured}
                                onCheckedChange={(v) => setData('is_featured', v)}
                            />
                            <Label htmlFor="edit-is_featured">Featured</Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}