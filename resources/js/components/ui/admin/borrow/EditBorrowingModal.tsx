import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { Borrowing } from "@/components/admin/borrow/columns"; 
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
import { Textarea } from "@/components/ui/textarea";
interface EditBorrowingModalProps {
    isOpen: boolean;
    onClose: () => void;
    borrowing: Borrowing | null;
}

export default function EditBorrowingModal({
    isOpen,
    onClose,
    borrowing,
}: EditBorrowingModalProps) {
    const [formData, setFormData] = useState({
        status: "dipinjam" as "dipinjam" | "kembali" | "terlambat",
        return_date: "",
        due_date: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (borrowing) {
            setFormData({
                status: borrowing.status,
                return_date: borrowing.return_date || "",
                due_date: borrowing.due_date || "",
                notes: borrowing.notes || "",
            });
        }
    }, [borrowing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!borrowing) return;

        setLoading(true);
        router.put(`/borrowings/${borrowing.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!borrowing) return null;

    const bookTitle = borrowing.book?.title || "Buku tidak diketahui";
    const borrowerName = borrowing.member?.memberable.nama_lengkap || borrowing.member?.memberable.user?.name || "Anggota";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Update Peminjaman</DialogTitle>
                    <DialogDescription>
                        Mengelola pengembalian buku: <strong className="text-foreground">{bookTitle}</strong>
                        oleh <strong className="text-foreground">{borrowerName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Status Peminjaman */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dipinjam">Dipinjam</SelectItem>
                                <SelectItem value="kembali">Sudah Kembali</SelectItem>
                                <SelectItem value="terlambat">Terlambat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date (Bisa diubah jika ada perpanjangan) */}
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Batas Kembali</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            />
                        </div>

                        {/* Return Date (Hanya diisi jika status 'kembali') */}
                        <div className="space-y-2">
                            <Label htmlFor="return_date">Tanggal Kembali</Label>
                            <Input
                                id="return_date"
                                type="date"
                                value={formData.return_date}
                                onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                                disabled={formData.status !== "kembali"}
                                className={formData.status === "kembali" ? "border-green-500" : ""}
                            />
                        </div>
                    </div>

                    {/* Catatan */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan Tambahan</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Cth: Buku kembali dalam keadaan lecet sedikit"
                            className="resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}