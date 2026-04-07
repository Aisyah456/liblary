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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AddPartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPartnerModal({ isOpen, onClose }: AddPartnerModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        logo: null as File | null,
        type: "mitra", // Default value
        email: "",
        phone: "",
        address: "",
        contact_person: "",
        mou_number: "",
        partnership_expiry: "",
        is_active: true,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/partners', { // Perhatikan URL ini
        forceFormData: true,
        onSuccess: () => handleClose(),
    });
};

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Partner</DialogTitle>
                    {/* Tambahkan baris ini */}
                    <DialogDescription>
                        Isi formulir di bawah untuk menambahkan mitra baru ke sistem.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Instansi</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Kategori</Label>
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
                        <Label htmlFor="logo">Logo Partner</Label>
                        <Input id="logo" type="file" accept="image/*" onChange={(e) => setData("logo", e.target.files?.[0] || null)} />
                        {errors.logo && <p className="text-xs text-destructive">{errors.logo}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">No. Telepon</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea id="address" value={data.address} onChange={(e) => setData("address", e.target.value)} rows={2} />
                    </div>

                    <hr className="my-2" />
                    <p className="text-sm font-semibold text-blue-600">Informasi Kerjasama (Opsional)</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input id="contact_person" value={data.contact_person} onChange={(e) => setData("contact_person", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mou_number">Nomor MoU</Label>
                            <Input id="mou_number" value={data.mou_number} onChange={(e) => setData("mou_number", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="grid gap-2">
                            <Label htmlFor="expiry">Masa Berlaku Kerjasama</Label>
                            <Input id="expiry" type="date" value={data.partnership_expiry} onChange={(e) => setData("partnership_expiry", e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3 pb-2 justify-end">
                            <Label htmlFor="is_active">Status Aktif</Label>
                            <Switch checked={data.is_active} onCheckedChange={(val) => setData("is_active", val)} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Simpan Partner</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}