import { router } from "@inertiajs/react";
import { useState } from "react";
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

interface AddLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddLoanModal({ isOpen, onClose }: AddLoanModalProps) {
    const today = new Date().toISOString().split('T')[0];

    // Default jatuh tempo 7 hari ke depan
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    const dueDateString = defaultDueDate.toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        user_id: "", // ID Mahasiswa/User
        book_id: "", // ID Buku dari master buku
        loan_date: today,
        due_date: dueDateString,
        status: "active",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post("/admin/loans", formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    user_id: "",
                    book_id: "",
                    loan_date: today,
                    due_date: dueDateString,
                    status: "active",
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Input Peminjaman Buku</DialogTitle>
                    <DialogDescription>
                        Daftarkan transaksi peminjaman buku baru ke dalam sistem.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="user_id">ID Peminjam (User ID)</Label>
                        <Input
                            id="user_id"
                            type="number"
                            placeholder="Masukkan ID Mahasiswa"
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="book_id">ID Buku</Label>
                        <Input
                            id="book_id"
                            type="number"
                            placeholder="Masukkan ID Buku"
                            value={formData.book_id}
                            onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="loan_date">Tanggal Pinjam</Label>
                            <Input
                                id="loan_date"
                                type="date"
                                value={formData.loan_date}
                                onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Jatuh Tempo</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Simpan Pinjaman"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}