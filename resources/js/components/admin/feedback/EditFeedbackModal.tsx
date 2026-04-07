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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FeedbackRow } from "@/pages/admin/cms/Feedback"; // Pastikan path interface benar
import { route } from "ziggy-js";

interface EditFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: FeedbackRow | null;
}

export default function EditFeedbackModal({ isOpen, onClose, feedback }: EditFeedbackModalProps) {
    // 1. Definisikan form sesuai schema library_feedback
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        category: '',
        rating: 5,
        message: '',
        type: '',
    });

    // 2. Sinkronisasi data saat modal dibuka dan feedback terpilih tersedia
    useEffect(() => {
        if (isOpen && feedback) {
            setData({
                category: feedback.category ?? '',
                rating: feedback.rating ?? 5,
                message: feedback.message ?? '',
                type: feedback.type ?? 'Saran',
            });
        }
    }, [isOpen, feedback]);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            clearErrors();
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback) return;

        // Gunakan put untuk update data teks
        put(route('Cms.feedback.update', feedback.id), {
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onError: (err) => console.error("Update gagal:", err)
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Feedback</DialogTitle>
                    <DialogDescription>
                        Perbarui kategori, rating, atau isi pesan masukan pengunjung.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Tipe (Saran/Aduan) */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-type">Tipe</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                            >
                                <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Saran">Saran</SelectItem>
                                    <SelectItem value="Aduan">Aduan</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                        </div>

                        {/* Rating */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-rating">Rating (1-5)</Label>
                            <Input
                                id="edit-rating"
                                type="number"
                                min="1"
                                max="5"
                                value={data.rating}
                                onChange={(e) => setData('rating', parseInt(e.target.value))}
                            />
                            {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
                        </div>
                    </div>

                    {/* Kategori */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-category">Kategori</Label>
                        <Select
                            value={data.category}
                            onValueChange={(value) => setData('category', value)}
                        >
                            <SelectTrigger id="edit-category">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Koleksi Buku">Koleksi Buku</SelectItem>
                                <SelectItem value="Layanan Digital">Layanan Digital</SelectItem>
                                <SelectItem value="Fasilitas Gedung">Fasilitas Gedung</SelectItem>
                                <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                    </div>

                    {/* Isi Pesan */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-message">Isi Pesan / Aduan</Label>
                        <Textarea
                            id="edit-message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            rows={5}
                            required
                        />
                        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                    </div>

                    <DialogFooter className="pt-4">
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