import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMembershipModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMembershipModal({ isOpen, onClose }: AddMembershipModalProps) {
    const [formData, setFormData] = useState({
        library_card_number: "",
        memberable_type: "App\\Models\\Student", // Default ke Mahasiswa
        memberable_id: "", // ID dari database Student/Lecturer
        status: "Aktif",
        joined_at: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/memberships", formData, {
            onSuccess: () => {
                onClose();
                setFormData({ ...formData, library_card_number: "", memberable_id: "" });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Daftarkan Anggota Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nomor Kartu</Label>
                        <Input
                            value={formData.library_card_number}
                            onChange={(e) => setFormData({ ...formData, library_card_number: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>ID Anggota (Student/Lecturer ID)</Label>
                        <Input
                            type="number"
                            value={formData.memberable_id}
                            onChange={(e) => setFormData({ ...formData, memberable_id: e.target.value })}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}