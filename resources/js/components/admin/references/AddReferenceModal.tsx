import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddBookSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBookSuggestionModal({
    isOpen,
    onClose,
}: AddBookSuggestionModalProps) {
    // Form state disesuaikan dengan schema table book_suggestions
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        publication_year: new Date().getFullYear().toString(),
        reason: "",
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pastikan URL-nya adalah '/book-suggestions' (sesuai route di Laravel)
        post('/references', {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Usulkan Buku Baru</DialogTitle>
                    <DialogDescription>
                        Bantu kami memperkaya koleksi perpustakaan dengan memberikan usulan buku yang bermanfaat.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Judul Buku */}
                    <div className="grid gap-2">
                        <Label htmlFor="book-title">Judul Buku</Label>
                        <Input
                            id="book-title"
                            placeholder="Contoh: Laskar Pelangi"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            disabled={processing}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    {/* Penulis & Tahun Terbit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="book-author">Penulis</Label>
                            <Input
                                id="book-author"
                                placeholder="Nama penulis"
                                value={data.author}
                                onChange={(e) => setData("author", e.target.value)}
                                disabled={processing}
                            />
                            {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="book-year">Tahun Terbit</Label>
                            <Input
                                id="book-year"
                                type="number"
                                placeholder="YYYY"
                                value={data.publication_year}
                                onChange={(e) => setData("publication_year", e.target.value)}
                                disabled={processing}
                            />
                            {errors.publication_year && <p className="text-xs text-destructive">{errors.publication_year}</p>}
                        </div>
                    </div>

                    {/* Penerbit & ISBN */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="book-publisher">Penerbit (Opsional)</Label>
                            <Input
                                id="book-publisher"
                                placeholder="Nama penerbit"
                                value={data.publisher}
                                onChange={(e) => setData("publisher", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="book-isbn">ISBN (Opsional)</Label>
                            <Input
                                id="book-isbn"
                                placeholder="Contoh: 978-602..."
                                value={data.isbn}
                                onChange={(e) => setData("isbn", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Alasan Usulan */}
                    <div className="grid gap-2">
                        <Label htmlFor="book-reason">Alasan Usulan</Label>
                        <Textarea
                            id="book-reason"
                            placeholder="Mengapa buku ini perlu ada di perpustakaan kita?"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            disabled={processing}
                            rows={4}
                        />
                        {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Mengirim..." : "Kirim Usulan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}