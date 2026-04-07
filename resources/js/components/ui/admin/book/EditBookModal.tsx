import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { Book } from "@/components/admin/book/columns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  
import { Textarea } from "@/components/ui/textarea";

interface EditBorrowingModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}
export default function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        isbn: "",
        author: "",
        publisher: "",
        publication_year: 0,
        genre: "",
        category: "",
        description: "",
        total_stock: 0,
    });

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                isbn: book.isbn || "",
                author: book.author,
                publisher: book.publisher || "",
                publication_year: book.publication_year || 0,
                genre: book.genre || "",
                category: book.category || "",
                description: book.description || "",
                total_stock: book.total_stock,
            });
        }
    }, [book]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;
        setLoading(true);
        router.put(`/admin/books/${book.id}`, formData, {
            onSuccess: () => onClose(),
            onFinish: () => setLoading(false),
        });
    };

    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Buku: {book.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Isi form sama dengan AddBookModal, pastikan value mengacu ke formData */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Judul Buku</Label>
                        <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Penulis</Label>
                            <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Stok</Label>
                            <Input type="number" value={formData.total_stock} onChange={(e) => setFormData({ ...formData, total_stock: parseInt(e.target.value) })} required />
                        </div>
                    </div>
                    {/* ... tambahkan field lainnya sesuai kebutuhan ... */}
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Memperbarui..." : "Update Buku"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}