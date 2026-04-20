// @ts-nocheck
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { ReferenceBook } from "@/components/admin/references/columns"; // Pastikan path import benar
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: ReferenceBook | null;
    onUpdate: (updatedBook: ReferenceBook) => void;
}

export default function EditReferenceModal({
    isOpen,
    onClose,
    book,
    onUpdate,
}: EditReferenceModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        publication_year: "",
        genre: "",
        description: "",
        total_stock: "",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    // Sync data ketika modal dibuka atau data 'book' dari baris tabel berubah
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || "",
                author: book.author || "",
                isbn: book.isbn || "",
                publisher: book.publisher || "",
                publication_year: book.publication_year?.toString() || "",
                genre: book.genre || "",
                description: book.description || "", // Pastikan field ini ada di tipe ReferenceBook
                total_stock: book.total_stock?.toString() || "0",
            });
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        setLoading(true);
        setMessage(null);

        // Mengarah ke endpoint update referensi (Laravel: references.update)
        router.put(`/admin/references/${book.id}`, formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Mengambil data terbaru hasil update
                const updatedData = {
                    ...book, ...formData,
                    publication_year: parseInt(formData.publication_year),
                    total_stock: parseInt(formData.total_stock)
                };

                setMessage({ type: "success", text: "Data buku berhasil diperbarui." });
                onUpdate(updatedData as unknown as ReferenceBook);

                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 800);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({ type: "error", text: "Gagal memperbarui data. Periksa kembali inputan Anda." });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Buku Referensi</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {message && (
                        <div
                            className={`p-2 rounded text-sm font-medium ${message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit_title">Judul Buku</Label>
                        <Input
                            id="edit_title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_author">Penulis</Label>
                            <Input
                                id="edit_author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_isbn">ISBN</Label>
                            <Input
                                id="edit_isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_publisher">Penerbit</Label>
                            <Input
                                id="edit_publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_year">Tahun Terbit</Label>
                            <Input
                                id="edit_year"
                                name="publication_year"
                                type="number"
                                value={formData.publication_year}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_genre">Jenis / Genre</Label>
                            <Input
                                id="edit_genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder="Kamus, Ensiklopedia..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_stock">Total Stok</Label>
                            <Input
                                id="edit_stock"
                                name="total_stock"
                                type="number"
                                value={formData.total_stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_desc">Deskripsi</Label>
                        <Textarea
                            id="edit_desc"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="min-h-[100px]"
                        />
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}