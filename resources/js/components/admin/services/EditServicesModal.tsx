import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT', // Method spoofing untuk Laravel
        icon: "",
        title: "",
        subtitle: "",
        description: "",
        features: [] as string[],
        link: "",
        order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (service) {
            setData({
                _method: 'PUT',
                icon: service.icon || "",
                title: service.title || "",
                subtitle: service.subtitle || "",
                description: service.description || "",
                features: service.features || [""],
                link: service.link || "#",
                order: service.order || 0,
                is_active: !!service.is_active,
            });
        }
    }, [service]);

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan POST dengan _method PUT agar lebih aman saat upload/data kompleks
        post(`/admin/services/${service?.id}`, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Layanan</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nama Layanan</Label>
                            <Input value={data.title} onChange={e => setData("title", e.target.value)} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Ikon</Label>
                            <Input value={data.icon} onChange={e => setData("icon", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input value={data.subtitle} onChange={e => setData("subtitle", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Fitur</Label>
                        {data.features.map((f, i) => (
                            <div key={i} className="flex gap-2">
                                <Input value={f} onChange={e => handleFeatureChange(i, e.target.value)} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setData("features", data.features.filter((_, idx) => idx !== i))}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setData("features", [...data.features, ""])}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Tambah Fitur
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Label>Order</Label>
                            <Input type="number" value={data.order} onChange={e => setData("order", parseInt(e.target.value))} />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Switch checked={data.is_active} onCheckedChange={v => setData("is_active", v)} />
                            <Label>Aktif</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}