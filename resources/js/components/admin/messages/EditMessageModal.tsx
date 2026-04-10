import { useForm } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "../../../pages/admin/cms/Services";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export default function EditServiceModal({ isOpen, onClose, service }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'PUT', // Spoofing method untuk Laravel multipart/form-data
        icon: null as File | string | null,
        title: "",
        subtitle: "",
        description: "",
        features: [] as string[],
        link: "",
        order: 0,
        is_active: true,
    });

    // Sinkronisasi data saat modal dibuka atau service berganti
    useEffect(() => {
        if (service) {
            setData({
                _method: 'PUT',
                icon: service.icon || null,
                title: service.title || "",
                subtitle: service.subtitle || "",
                description: service.description || "",
                features: Array.isArray(service.features) ? service.features : [""],
                link: service.link || "#",
                order: service.order || 0,
                is_active: !!service.is_active,
            });

            // Jika icon sudah ada (string URL dari backend), set sebagai preview
            if (typeof service.icon === 'string' && service.icon) {
                setPreview(service.icon);
            } else {
                setPreview(null);
            }
        }
    }, [service, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("icon", file);
            setPreview(URL.createObjectURL(file));
        }
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan POST karena Laravel membutuhkan spoofing _method: PUT
        // ketika mengirim data yang mengandung file/multipart
        post(`/admin/services/${service?.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Layanan</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi layanan yang sudah ada di sistem.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-5 py-4">
                    {/* Upload/Edit Ikon Section */}
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
                                    Ganti Gambar
                                </Button>
                                <p className="text-[10px] text-muted-foreground">
                                    Format: JPG, PNG, SVG. Maks 2MB.
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        {errors.icon && <p className="text-xs text-destructive">{errors.icon}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Nama Layanan</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={e => setData("title", e.target.value)}
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Link Tujuan</Label>
                            <Input
                                id="link"
                                value={data.link}
                                onChange={e => setData("link", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                            id="subtitle"
                            value={data.subtitle}
                            onChange={e => setData("subtitle", e.target.value)}
                        />
                        {errors.subtitle && <p className="text-xs text-destructive">{errors.subtitle}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Detail</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Features Section */}
                    <div className="grid gap-3 border p-3 rounded-md bg-muted/30">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-bold text-blue-600">Fitur Utama</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setData("features", [...data.features, ""])}
                                className="h-7 gap-1"
                            >
                                <Plus className="h-3 w-3" /> Tambah
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            {data.features.map((f, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input
                                        placeholder={`Fitur ${i + 1}`}
                                        value={f}
                                        onChange={e => handleFeatureChange(i, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setData("features", data.features.filter((_, idx) => idx !== i))}
                                        className="text-destructive shrink-0"
                                        disabled={data.features.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="order">Urutan Tampil</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={e => setData("order", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pb-2 justify-end">
                            <Label htmlFor="is_active">Status Aktif</Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={v => setData("is_active", v)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}