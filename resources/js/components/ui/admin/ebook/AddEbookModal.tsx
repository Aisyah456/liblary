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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AddEbookModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: number; name: string }[];
}

export default function AddEbookModal({ isOpen, onClose, categories }: AddEbookModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        author: '',
        category_id: '' as string | number,
        file: null as File | null,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/ebooks', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah E-Book</DialogTitle>
                    <DialogDescription>Unggah file PDF atau EPUB beserta metadata dasar.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="ebook-title">Judul</Label>
                        <Input
                            id="ebook-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ebook-author">Penulis</Label>
                        <Input
                            id="ebook-author"
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
                        <Label htmlFor="ebook-file">File (PDF / EPUB)</Label>
                        <Input
                            id="ebook-file"
                            type="file"
                            accept=".pdf,.epub"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            required
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
