import { useForm } from "@inertiajs/react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
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
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        icon: null as File | null, // Berubah dari string ke File
        title: "",
        subtitle: "",
        description: "",
        features: [""] as string[],
        link: "#",
        order: 0,
        is_active: true,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("icon", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData("icon", null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const addFeature = () => setData("features", [...data.features, ""]);

    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData("features", newFeatures);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setPreview(null);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia otomatis menggunakan FormData jika salah satu field adalah File
        post('/admin/services', {
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
                        Lengkapi detail layanan dan unggah foto ikon untuk tampilan landing page.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                    {/* Upload Foto Section */}
                    <div className="grid gap-2">
                        <Label>Ikon / Foto Layanan</Label>
                        <div className="flex items-center gap-4">
                            <div
                                className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors cursor-pointer overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Pilih Gambar
                                </Button>
                                <p className="text-[10px] text-muted-foreground text-pretty">
                                    JPG, PNG atau SVG. Maksimal 2MB.
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0 text-destructive text-xs justify-start"
                                        onClick={removeImage}
                                    >
                                        Hapus Gambar
                                    </Button>
                                )}
                            </div>
                        </div>
                        {errors.icon && <p className="text-xs text-destructive">{errors.icon}</p>}
                    </div>

                    {/* Nama Layanan */}
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

                    {/* Subtitle */}
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle">Subtitle (Deskripsi Kartu)</Label>
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

                    {/* Fitur Utama */}
                    <div className="grid gap-3 border p-3 rounded-md bg-muted/30">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-bold text-blue-600">Fitur Utama</Label>
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
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFeature(index)}
                                        className="text-destructive shrink-0"
                                        disabled={data.features.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order & Link & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="grid gap-2">
                            <Label htmlFor="order">Urutan Tampil</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData("order", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="link">Link Tujuan</Label>
                            <Input
                                id="link"
                                value={data.link}
                                onChange={(e) => setData("link", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pb-2 justify-end">
                            <Label htmlFor="is_active">Aktif</Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(val) => setData("is_active", val)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
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