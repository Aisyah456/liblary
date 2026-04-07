import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 

interface AddBorrowingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBorrowingModal({ isOpen, onClose }: AddBorrowingModalProps) {
    const today = new Date().toISOString().split('T')[0];

    // Default batas kembali adalah 7 hari dari sekarang
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    const dueDateString = defaultDueDate.toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        member_id: "",
        book_id: "",
        borrow_date: today,
        due_date: dueDateString,
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/borrowings", formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    member_id: "",
                    book_id: "",
                    borrow_date: today,
                    due_date: dueDateString,
                    notes: ""
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Catat Peminjaman Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="member_id">ID Anggota</Label>
                            <Input
                                id="member_id"
                                type="number"
                                placeholder="Cth: 12"
                                value={formData.member_id}
                                onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="book_id">ID Buku</Label>
                            <Input
                                id="book_id"
                                type="number"
                                placeholder="Cth: 5"
                                value={formData.book_id}
                                onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="borrow_date">Tanggal Pinjam</Label>
                            <Input
                                id="borrow_date"
                                type="date"
                                value={formData.borrow_date}
                                onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Batas Kembali</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Kondisi buku atau informasi tambahan..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
                        <Button type="submit">Buat Peminjaman</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}