import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner"; // Opsional: gunakan library toast untuk UX lebih baik
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
    const { errors: serverErrors } = usePage().props;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        library_card_number: "",
        status: "Aktif" as "Aktif" | "Nonaktif",
        joined_at: "",
        expires_at: "",
    });

    // Reset data form saat modal dibuka atau membership berubah
    useEffect(() => {
        if (membership) {
            setFormData({
                library_card_number: membership.library_card_number || "",
                status: (membership.status as "Aktif" | "Nonaktif") || "Aktif",
                joined_at: membership.joined_at || "",
                expires_at: membership.expires_at || "",
            });
        }
    }, [membership, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!membership) return;

        setLoading(true);

        router.put(`/admin/memberships/${membership.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const updatedData = { ...membership, ...formData };
                onUpdate(updatedData as any);
                toast.success("Data keanggotaan berhasil diperbarui");
                onClose();
            },
            onError: (err) => {
                console.error("Update Error:", err);
                toast.error("Gagal memperbarui data. Periksa kembali inputan Anda.");
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!membership) return null;

    // Mendapatkan nama dari polymorphic relation
    const isLecturer = membership.memberable_type.includes("Lecturer");
    const memberName = isLecturer
        ? membership.memberable.nama_lengkap
        : membership.memberable.user?.name || "Anggota";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Update Keanggotaan</DialogTitle>
                    <DialogDescription>
                        Kelola data kartu perpustakaan untuk: <br />
                        <span className="font-bold text-foreground">{memberName}</span>
                        <span className="text-xs ml-1 opacity-70">
                            ({isLecturer ? 'Dosen' : 'Mahasiswa'})
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Nomor Kartu */}
                    <div className="space-y-2">
                        <Label htmlFor="library_card_number">Nomor Kartu Perpustakaan</Label>
                        <Input
                            id="library_card_number"
                            value={formData.library_card_number}
                            onChange={(e) => setFormData({ ...formData, library_card_number: e.target.value })}
                            className={serverErrors?.library_card_number ? "border-destructive" : ""}
                            required
                        />
                        {serverErrors?.library_card_number && (
                            <p className="text-xs text-destructive">{serverErrors.library_card_number}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status Keanggotaan</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val: "Aktif" | "Nonaktif") => setFormData({ ...formData, status: val })}
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

                    {/* Tanggal - Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joined_at">Tgl Gabung</Label>
                            <Input
                                id="joined_at"
                                type="date"
                                value={formData.joined_at}
                                onChange={(e) => setFormData({ ...formData, joined_at: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expires_at">Masa Berlaku</Label>
                            <Input
                                id="expires_at"
                                type="date"
                                value={formData.expires_at || ""}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}