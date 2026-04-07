import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Partner {
    id: number;
    name: string;
    logo: string | null;
    type: 'supplier' | 'mitra' | 'donator';
    email: string | null;
    phone: string | null;
    address: string | null;
    contact_person: string | null;
    mou_number: string | null;
    partnership_expiry: string | null;
    is_active: boolean | number;
}

interface EditPartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    partner: Partner | null;
}

export default function EditPartnerModal({ isOpen, onClose, partner }: EditPartnerModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: "PUT", // Spoofing method karena upload file lewat POST
        name: "",
        logo: null as File | null,
        type: "mitra",
        email: "",
        phone: "",
        address: "",
        contact_person: "",
        mou_number: "",
        partnership_expiry: "",
        is_active: true,
    });

    useEffect(() => {
        if (isOpen && partner) {
            setData({
                _method: "PUT",
                name: partner.name ?? "",
                logo: null,
                type: (partner.type as any) ?? "mitra",
                email: partner.email ?? "",
                phone: partner.phone ?? "",
                address: partner.address ?? "",
                contact_person: partner.contact_person ?? "",
                mou_number: partner.mou_number ?? "",
                partnership_expiry: partner.partnership_expiry ?? "",
                is_active: Boolean(partner.is_active),
            });
        }
    }, [isOpen, partner]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!partner) return;

        // Menggunakan post dengan _method: "PUT" untuk menangani file upload di Laravel
        post(`/admin/partners/${partner.id}`, {
            forceFormData: true,
            onSuccess: () => handleClose(),
            onError: (err) => console.log(err), // Cek error validasi di console
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Partner</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Nama Instansi</Label>
                            <Input value={data.name} onChange={(e) => setData("name", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Kategori</Label>
                            <Select value={data.type} onValueChange={(val: any) => setData("type", val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mitra">Mitra Kerjasama</SelectItem>
                                    <SelectItem value="supplier">Supplier Buku</SelectItem>
                                    <SelectItem value="donator">Donatur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Logo Baru (Kosongkan jika tidak diubah)</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setData("logo", e.target.files?.[0] || null)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={data.email} onChange={(e) => setData("email", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Telepon</Label>
                            <Input value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Alamat</Label>
                        <Textarea value={data.address} onChange={(e) => setData("address", e.target.value)} rows={2} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Nomor MoU</Label>
                            <Input value={data.mou_number} onChange={(e) => setData("mou_number", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Masa Berlaku</Label>
                            <Input type="date" value={data.partnership_expiry} onChange={(e) => setData("partnership_expiry", e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border p-3 rounded-md">
                        <Label>Status Aktif</Label>
                        <Switch checked={data.is_active} onCheckedChange={(val) => setData("is_active", val)} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}