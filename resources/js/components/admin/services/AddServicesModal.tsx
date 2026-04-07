import { useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
    // Form state disesuaikan dengan skema tabel services
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        icon: "",
        title: "",
        subtitle: "",
        description: "",
        features: [""] as string[], // Inisialisasi dengan satu input kosong
        link: "#",
        order: 0,
        is_active: true,
    });

    // Menambah baris fitur baru
    const addFeature = () => {
        setData("features", [...data.features, ""]);
    };

    // Menghapus baris fitur
    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData("features", newFeatures);
    };

    // Mengubah nilai fitur tertentu
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/services', { // Sesuaikan route store Anda
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Layanan Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi detail layanan yang akan ditampilkan di landing page.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                    {/* Judul & Icon */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Nama Layanan</Label>
                            <Input
                                id="title"
                                placeholder="Contoh: Web Development"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="icon">Ikon (Emoji atau Class)</Label>
                            <Input
                                id="icon"
                                placeholder="🚀 atau lucide-icon-name"
                                value={data.icon}
                                onChange={(e) => setData("icon", e.target.value)}
                            />
                            {errors.icon && <p className="text-xs text-destructive">{errors.icon}</p>}
                        </div>
                    </div>

                    {/* Subtitle (Deskripsi Singkat) */}
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle">Subtitle (Card Description)</Label>
                        <Input
                            id="subtitle"
                            placeholder="Deskripsi singkat yang tampil di kartu"
                            value={data.subtitle}
                            onChange={(e) => setData("subtitle", e.target.value)}
                        />
                        {errors.subtitle && <p className="text-xs text-destructive">{errors.subtitle}</p>}
                    </div>

                    {/* Deskripsi Lengkap */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi Detail (Opsional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Penjelasan mendalam tentang layanan..."
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Features (Dinamis JSON) */}
                    <div className="grid gap-3 border p-3 rounded-md bg-muted/30">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-bold text-primary text-blue-600">Fitur Utama</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addFeature} className="h-7 gap-1">
                                <Plus className="h-3 w-3" /> Tambah Fitur
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Fitur ${index + 1}`}
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    />
                                    {data.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFeature(index)}
                                            className="text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link & Order & Status */}
                    <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="order">Urutan Tampil</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData("order", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="link">Link Tujuan</Label>
                            <Input
                                id="link"
                                value={data.link}
                                onChange={(e) => setData("link", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pb-2 col-span-1 justify-end">
                            <Label htmlFor="is_active">Aktif</Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(val: boolean) => setData("is_active", val)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            {processing ? "Menyimpan..." : "Simpan Layanan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}