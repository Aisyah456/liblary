import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { Loan } from "@/components/admin/loans/columns";
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

interface EditLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan | null;
    onUpdate: (updatedLoan: Loan) => void;
}

export default function EditLoanModal({
    isOpen,
    onClose,
    loan,
    onUpdate,
}: EditLoanModalProps) {
    const [formData, setFormData] = useState({
        return_date: "",
        fine_amount: 0,
        status: "active" as "active" | "returned" | "overdue",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loan) {
            setFormData({
                return_date: loan.return_date || "",
                fine_amount: loan.fine_amount || 0,
                status: loan.status || "active",
            });
        }
    }, [loan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "fine_amount" ? parseInt(value) || 0 : value,
        }));
    };

    const handleStatusChange = (value: "active" | "returned" | "overdue") => {
        setFormData((prev) => ({
            ...prev,
            status: value,
            // Jika status diubah ke returned, otomatis isi tanggal hari ini jika masih kosong
            return_date: value === "returned" && !prev.return_date
                ? new Date().toISOString().split('T')[0]
                : prev.return_date
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loan) return;

        setLoading(true);
        setMessage(null);

        router.put(`/admin/loans/${loan.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const updatedData = { ...loan, ...formData };
                setMessage({ type: "success", text: "Data peminjaman berhasil diperbarui." });
                onUpdate(updatedData as any);

                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 800);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({ type: "error", text: "Gagal memperbarui data. Periksa kembali inputan." });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!loan) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Update Status Peminjaman</DialogTitle>
                    <DialogDescription>
                        Kelola pengembalian buku dan denda untuk: <br />
                        <strong className="text-foreground">{loan.user?.name}</strong> - <span className="text-muted-foreground italic">{loan.book?.title}</span>
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
                        <Label htmlFor="status">Status Peminjaman</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: any) => handleStatusChange(value)}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Dipinjam (Active)</SelectItem>
                                <SelectItem value="returned">Dikembalikan (Returned)</SelectItem>
                                <SelectItem value="overdue">Terlambat (Overdue)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="return_date">Tanggal Pengembalian</Label>
                        <Input
                            id="return_date"
                            name="return_date"
                            type="date"
                            value={formData.return_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fine_amount">Jumlah Denda (Rp)</Label>
                        <Input
                            id="fine_amount"
                            name="fine_amount"
                            type="number"
                            min="0"
                            value={formData.fine_amount}
                            onChange={handleChange}
                            placeholder="0"
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                            *Isi 0 jika tidak ada denda.
                        </p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}