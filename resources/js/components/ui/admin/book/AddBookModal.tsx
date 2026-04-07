import { useForm } from "@inertiajs/react"; // Menggunakan hook useForm
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
    // Inisialisasi useForm Inertia
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "",
        isbn: "",
        author: "",
        publisher: "",
        publication_year: new Date().getFullYear(),
        genre: "",
        category: "",
        description: "",
        total_stock: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/books", {
            onSuccess: () => {
                reset(); // Reset form jika berhasil
                onClose();
            },
            // Menjaga agar modal tidak tertutup jika ada error validasi
        });
    };

    const handleClose = () => {
        clearErrors();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Koleksi Buku</DialogTitle>
                    <DialogDescription className="sr-only">
                        Isi formulir di bawah ini untuk menambah data buku baru ke perpustakaan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    {/* Judul Buku */}
                    <div className="space-y-1">
                        <Label htmlFor="title">Judul Buku <span className="text-destructive">*</span></Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input id="isbn" value={data.isbn} onChange={(e) => setData("isbn", e.target.value)} />
                            {errors.isbn && <p className="text-xs text-destructive">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="author">Penulis <span className="text-destructive">*</span></Label>
                            <Input id="author" value={data.author} onChange={(e) => setData("author", e.target.value)} />
                            {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="publisher">Penerbit</Label>
                            <Input id="publisher" value={data.publisher} onChange={(e) => setData("publisher", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="year">Tahun Terbit</Label>
                            <Input
                                id="year"
                                type="number"
                                value={data.publication_year}
                                onChange={(e) => setData("publication_year", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="category">Kategori</Label>
                            <Input id="category" value={data.category} onChange={(e) => setData("category", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="stock">Total Stok <span className="text-destructive">*</span></Label>
                            <Input
                                id="stock"
                                type="number"
                                value={data.total_stock}
                                onChange={(e) => setData("total_stock", parseInt(e.target.value) || 0)}
                            />
                            {errors.total_stock && <p className="text-xs text-destructive">{errors.total_stock}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description">Deskripsi Singkat</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="h-24 resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="ghost" type="button" onClick={handleClose} disabled={processing}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Koleksi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}