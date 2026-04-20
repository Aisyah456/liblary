// @ts-nocheck
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { LibraryClearance } from "@/components/admin/library-clearance/columns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface EditClearanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    clearance: LibraryClearance | null;
    onUpdate: (updatedClearance: LibraryClearance) => void;
}

export default function EditClearanceModal({
    isOpen,
    onClose,
    clearance,
    onUpdate,
}: EditClearanceModalProps) {
    const [formData, setFormData] = useState({
        certificate_number: "",
        has_returned_all_books: false,
        has_paid_fines: false,
        status: "request" as "request" | "verified" | "rejected",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (clearance) {
            setFormData({
                certificate_number: clearance.certificate_number || "",
                has_returned_all_books: !!clearance.has_returned_all_books,
                has_paid_fines: !!clearance.has_paid_fines,
                status: clearance.status || "request",
            });
        }
    }, [clearance]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clearance) return;

        setLoading(true);
        setMessage(null);

        // Mengarah ke route resource library-clearances.update
        router.put(`/admin/library-clearances/${clearance.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const updatedData = { ...clearance, ...formData };
                setMessage({ type: "success", text: "Data bebas pustaka berhasil diperbarui." });
                onUpdate(updatedData);

                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 800);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({ type: "error", text: "Gagal memperbarui data. Pastikan nomor sertifikat unik." });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!clearance) return null;

    const studentName = clearance.user?.name || "Mahasiswa";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Verifikasi Bebas Pustaka</DialogTitle>
                    <DialogDescription>
                        Proses pengajuan dan nomor sertifikat untuk: <strong className="text-foreground">{studentName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {message && (
                        <div className={`p-2 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="certificate_number">Nomor Sertifikat Bebas Pustaka</Label>
                        <Input
                            id="certificate_number"
                            value={formData.certificate_number}
                            onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                            placeholder="Contoh: CERT/LIB/2026/001"
                        />
                        <p className="text-[0.7rem] text-muted-foreground italic">* Kosongkan jika status masih Request</p>
                    </div>

                    <div className="space-y-3 border p-3 rounded-md bg-slate-50">
                        <Label className="text-xs uppercase text-slate-500 font-bold">Checklist Persyaratan</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="books" 
                                checked={formData.has_returned_all_books}
                                onCheckedChange={(checked) => setFormData({ ...formData, has_returned_all_books: !!checked })}
                            />
                            <Label htmlFor="books" className="text-sm cursor-pointer">Semua buku sudah kembali</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="fines" 
                                checked={formData.has_paid_fines}
                                onCheckedChange={(checked) => setFormData({ ...formData, has_paid_fines: !!checked })}
                            />
                            <Label htmlFor="fines" className="text-sm cursor-pointer">Bebas tunggakan denda</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Pengajuan</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="request">Request (Menunggu)</SelectItem>
                                <SelectItem value="verified">Verified (Disetujui)</SelectItem>
                                <SelectItem value="rejected">Rejected (Ditolak)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading ? "Menyimpan..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}