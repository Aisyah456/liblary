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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { route } from "ziggy-js";

interface AddFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddFeedbackModal({ isOpen, onClose }: AddFeedbackModalProps) {
    // 1. Inisialisasi sesuai skema database library_feedback
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category: '',     // Koleksi Buku, Layanan Digital, dll
        rating: 5,        // Default rating 5
        message: '',      // Isi pesan
        type: 'Saran',    // Default tipe
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti ke rute feedback (contoh: admin.feedback.store)
        post(route('Cms.feedback.store'), {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Feedback Manual</DialogTitle>
                    <DialogDescription>
                        Input masukan atau aduan dari pengunjung perpustakaan secara manual.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Tipe (Saran/Aduan) */}
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipe Masukan</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                            >
                                <SelectTrigger>
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
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input
                                id="rating"
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
                        <Label htmlFor="category">Kategori</Label>
                        <Select
                            value={data.category}
                            onValueChange={(value) => setData('category', value)}
                        >
                            <SelectTrigger>
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

                    {/* Isi Pesan/Aduan */}
                    <div className="grid gap-2">
                        <Label htmlFor="message">Isi Pesan / Aduan</Label>
                        <Textarea
                            id="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Tuliskan isi masukan di sini..."
                            rows={4}
                            required
                        />
                        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Feedback'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}