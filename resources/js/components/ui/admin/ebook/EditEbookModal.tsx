import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { Membership } from "@/components/admin/membership/columns";
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

interface EditMembershipModalProps {
    isOpen: boolean;
    onClose: () => void;
    membership: Membership | null;
    onUpdate: (updatedMembership: Membership) => void;
}

export default function EditMembershipModal({
    isOpen,
    onClose,
    membership,
    onUpdate,
}: EditMembershipModalProps) {
    const [formData, setFormData] = useState({
        library_card_number: "",
        status: "Aktif" as "Aktif" | "Nonaktif",
        joined_at: "",
        expires_at: "",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (membership) {
            setFormData({
                library_card_number: membership.library_card_number || "",
                status: membership.status || "Aktif",
                joined_at: membership.joined_at || "",
                expires_at: membership.expires_at || "",
            });
        }
    }, [membership]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusChange = (value: "Aktif" | "Nonaktif") => {
        setFormData((prev) => ({
            ...prev,
            status: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!membership) return;

        setLoading(true);
        setMessage(null);

        // Mengarah ke route resource memberships.update
        router.put(`/memberships/${membership.id}`, formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedData = { ...membership, ...formData };
                setMessage({ type: "success", text: "Data keanggotaan berhasil diperbarui." });
                onUpdate(updatedData as any);

                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 800);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({ type: "error", text: "Gagal memperbarui data. Cek kembali inputan Anda." });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!membership) return null;

    // Mendapatkan nama dari polymorphic relation memberable
    const memberName = membership.memberable.nama_lengkap || membership.memberable.user?.name || "Anggota";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit Keanggotaan</DialogTitle>
                    <DialogDescription>
                        Memperbarui status atau masa berlaku kartu untuk: <strong className="text-foreground">{memberName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {message && (
                        <div className={`p-2 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="library_card_number">Nomor Kartu Perpustakaan</Label>
                        <Input
                            id="library_card_number"
                            name="library_card_number"
                            value={formData.library_card_number}
                            onChange={handleChange}
                            placeholder="Contoh: LIB-2024-XXXX"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Anggota</Label>
                        <Select
                            value={formData.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joined_at">Tanggal Bergabung</Label>
                            <Input
                                id="joined_at"
                                name="joined_at"
                                type="date"
                                value={formData.joined_at}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expires_at">Masa Berlaku</Label>
                            <Input
                                id="expires_at"
                                name="expires_at"
                                type="date"
                                value={formData.expires_at}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading ? "Menyimpan..." : "Update Keanggotaan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}