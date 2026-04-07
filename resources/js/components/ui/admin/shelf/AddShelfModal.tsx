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

interface AddShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddShelfModal = ({ isOpen, onClose }: AddShelfModalProps) => {
    // Menggunakan useForm dari Inertia untuk handling post dan validasi
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: "",     // Contoh: RAK-001
        name: "",     // Contoh: Rak Buku Fiksi
        location: "", // Contoh: Lantai 1, Sayap Kanan
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/shelves", {
            onSuccess: () => {
                handleClose();
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Tambah Rak Baru</DialogTitle>
                    <DialogDescription>
                        Daftarkan lokasi rak baru untuk manajemen penyimpanan koleksi buku.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                    {/* Kode Rak */}
                    <div className="grid gap-2">
                        <Label htmlFor="code" className={errors.code ? "text-destructive" : ""}>
                            Kode Rak
                        </Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value)}
                            placeholder="Masukkan kode unik (misal: RAK-01)"
                            disabled={processing}
                            className={errors.code ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.code && <p className="text-xs text-destructive font-medium">{errors.code}</p>}
                    </div>

                    {/* Nama Rak */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                            Nama Rak
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Nama deskriptif rak"
                            disabled={processing}
                            className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
                    </div>

                    {/* Lokasi Rak */}
                    <div className="grid gap-2">
                        <Label htmlFor="location" className={errors.location ? "text-destructive" : ""}>
                            Lokasi Detail
                        </Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData("location", e.target.value)}
                            placeholder="Contoh: Gedung A, Lantai 2"
                            disabled={processing}
                            className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.location && <p className="text-xs text-destructive font-medium">{errors.location}</p>}
                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        >
                            {processing ? "Menyimpan..." : "Simpan Rak"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddShelfModal;