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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Ebook } from '@/pages/Ebooks';

interface EditEbookModalProps {
    isOpen: boolean;
    onClose: () => void;
    ebook: Ebook | null;
    categories: { id: number; name: string }[];
    onUpdate: (e: Ebook) => void;
}

export default function EditEbookModal({ isOpen, onClose, ebook, categories, onUpdate }: EditEbookModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'put' as const,
        title: '',
        author: '',
        category_id: '' as string | number,
        file: null as File | null,
    });

    useEffect(() => {
        if (isOpen && ebook) {
            setData({
                _method: 'put',
                title: ebook.title ?? '',
                author: ebook.author ?? '',
                category_id: ebook.category_id ?? '',
                file: null,
            });
        }
    }, [isOpen, ebook]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ebook) return;

        post(`/admin/ebooks/${ebook.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onUpdate({
                    ...ebook,
                    title: String(data.title),
                    author: String(data.author),
                    category_id: Number(data.category_id),
                });
                handleClose();
            },
        });
    };

    if (!ebook) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit E-Book</DialogTitle>
                    <DialogDescription>Perbarui metadata; unggah file baru hanya jika ingin mengganti dokumen.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-ebook-title">Judul</Label>
                        <Input
                            id="edit-ebook-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-ebook-author">Penulis</Label>
                        <Input
                            id="edit-ebook-author"
                            value={data.author}
                            onChange={(e) => setData('author', e.target.value)}
                            required
                        />
                        {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Kategori</Label>
                        <Select
                            value={data.category_id ? String(data.category_id) : ''}
                            onValueChange={(v) => setData('category_id', v)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-ebook-file">File baru (opsional)</Label>
                        <Input
                            id="edit-ebook-file"
                            type="file"
                            accept=".pdf,.epub"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                        />
                        {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                    </div>

                    <DialogFooter className="gap-2">
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
