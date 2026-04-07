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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Category {
    id: number;
    name: string;
}

interface AddScientificWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

const AddScientificWorkModal = ({ isOpen, onClose, categories }: AddScientificWorkModalProps) => {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category_id: "", // Disimpan sebagai string karena Select shadcn menggunakan string
        title: "",
        researcher: "",
        publication_year: new Date().getFullYear().toString(),
        doi: "",
        abstract: "",
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/scientific-works", {
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
                    <DialogTitle>Tambah Karya Ilmiah Baru</DialogTitle>
                    <DialogDescription>
                        Masukkan detail publikasi jurnal atau karya ilmiah ke dalam koleksi perpustakaan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Judul Karya Ilmiah */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul Karya Ilmiah</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Masukkan judul lengkap jurnal/penelitian"
                            disabled={processing}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="researcher">Peneliti / Penulis</Label>
                            <Input
                                id="researcher"
                                value={data.researcher}
                                onChange={(e) => setData("researcher", e.target.value)}
                                placeholder="Nama peneliti"
                                disabled={processing}
                            />
                            {errors.researcher && <p className="text-xs text-destructive">{errors.researcher}</p>}
                        </div>

                        {/* Dropdown Kategori Berdasarkan Database */}
                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Kategori Koleksi</Label>
                            <Select
                                onValueChange={(value) => setData("category_id", value)}
                                value={data.category_id}
                                disabled={processing}
                            >
                                <SelectTrigger id="category_id">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Looping data dari database (melalui props) */}
                                    {categories && categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="0" disabled>Kategori Kosong</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="publication_year">Tahun Publikasi</Label>
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
                        <div className="grid gap-2">
                            <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
                            <Input
                                id="doi"
                                value={data.doi}
                                onChange={(e) => setData("doi", e.target.value)}
                                placeholder="10.xxxx/xxxxx"
                                disabled={processing}
                            />
                            {errors.doi && <p className="text-xs text-destructive">{errors.doi}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="abstract">Abstrak / Ringkasan</Label>
                        <Textarea
                            id="abstract"
                            value={data.abstract}
                            onChange={(e) => setData("abstract", e.target.value)}
                            placeholder="Tuliskan ringkasan singkat isi karya ilmiah..."
                            className="min-h-[100px]"
                            disabled={processing}
                        />
                        {errors.abstract && <p className="text-xs text-destructive">{errors.abstract}</p>}
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
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                            {processing ? "Menyimpan..." : "Simpan Karya Ilmiah"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddScientificWorkModal;