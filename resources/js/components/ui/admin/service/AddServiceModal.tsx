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

interface AddReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddReferenceModal = ({ isOpen, onClose }: AddReferenceModalProps) => {
    // Menggunakan useForm dari Inertia sesuai struktur tabel 'books'
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        publication_year: new Date().getFullYear().toString(),
        genre: "", // Misal: Kamus, Ensiklopedia, Atlas
        category: "Referensi", // Default diset ke Referensi
        description: "",
        total_stock: "1",
        available_stock: "1",
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mengarah ke route resource references
        post("/references", {
            onSuccess: () => {
                handleClose();
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Buku Referensi Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi detail buku untuk koleksi layanan referensi perpustakaan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Judul Buku */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul Buku</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Masukkan judul lengkap buku"
                            disabled={processing}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Penulis */}
                        <div className="grid gap-2">
                            <Label htmlFor="author">Penulis</Label>
                            <Input
                                id="author"
                                value={data.author}
                                onChange={(e) => setData("author", e.target.value)}
                                placeholder="Nama penulis"
                                disabled={processing}
                            />
                            {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
                        </div>

                        {/* ISBN */}
                        <div className="grid gap-2">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) => setData("isbn", e.target.value)}
                                placeholder="Nomor ISBN"
                                disabled={processing}
                            />
                            {errors.isbn && <p className="text-xs text-destructive">{errors.isbn}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Penerbit */}
                        <div className="grid gap-2">
                            <Label htmlFor="publisher">Penerbit</Label>
                            <Input
                                id="publisher"
                                value={data.publisher}
                                onChange={(e) => setData("publisher", e.target.value)}
                                placeholder="Nama penerbit"
                                disabled={processing}
                            />
                            {errors.publisher && <p className="text-xs text-destructive">{errors.publisher}</p>}
                        </div>

                        {/* Tahun Terbit */}
                        <div className="grid gap-2">
                            <Label htmlFor="publication_year">Tahun Terbit</Label>
                            <Input
                                id="publication_year"
                                type="number"
                                value={data.publication_year}
                                onChange={(e) => setData("publication_year", e.target.value)}
                                placeholder="Contoh: 2024"
                                disabled={processing}
                            />
                            {errors.publication_year && <p className="text-xs text-destructive">{errors.publication_year}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Genre / Sub-Kategori */}
                        <div className="grid gap-2">
                            <Label htmlFor="genre">Jenis Referensi</Label>
                            <Input
                                id="genre"
                                value={data.genre}
                                onChange={(e) => setData("genre", e.target.value)}
                                placeholder="Kamus, Atlas, Ensiklopedia..."
                                disabled={processing}
                            />
                        </div>

                        {/* Stok */}
                        <div className="grid gap-2">
                            <Label htmlFor="total_stock">Jumlah Stok</Label>
                            <Input
                                id="total_stock"
                                type="number"
                                value={data.total_stock}
                                onChange={(e) => {
                                    setData((prev) => ({
                                        ...prev,
                                        total_stock: e.target.value,
                                        available_stock: e.target.value // Otomatis samakan stok awal
                                    }));
                                }}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi / Sinopsis</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Ringkasan singkat mengenai isi buku..."
                            className="min-h-[100px]"
                            disabled={processing}
                        />
                        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {processing ? "Menyimpan..." : "Simpan Buku Referensi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddReferenceModal;