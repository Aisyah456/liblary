import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Asumsi menggunakan checkbox shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddClearanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddClearanceModal({ isOpen, onClose }: AddClearanceModalProps) {
    const [formData, setFormData] = useState({
        user_id: "",
        certificate_number: "",
        has_returned_all_books: false,
        has_paid_fines: false,
        status: "request",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/admin/library-clearances", formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    user_id: "",
                    certificate_number: "",
                    has_returned_all_books: false,
                    has_paid_fines: false,
                    status: "request"
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Input Pengajuan Bebas Pustaka</DialogTitle>
                    {/* Tambahkan ini untuk menghilangkan warning */}
                    <DialogDescription className="sr-only">
                        Formulir untuk memproses status bebas pustaka mahasiswa.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User ID */}
                    <div className="space-y-2">
                        <Label htmlFor="user_id">ID Pengguna (User ID)</Label>
                        <Input
                            id="user_id"
                            type="number"
                            placeholder="Masukkan ID Mahasiswa"
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            required
                        />
                    </div>

                    {/* Certificate Number (Optional pada awal pengajuan) */}
                    <div className="space-y-2">
                        <Label htmlFor="cert_no">Nomor Sertifikat (Opsional)</Label>
                        <Input
                            id="cert_no"
                            placeholder="Kosongkan jika belum terbit"
                            value={formData.certificate_number}
                            onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                        />
                    </div>

                    {/* Checkboxes untuk Verifikasi Manual */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="books"
                                checked={formData.has_returned_all_books}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, has_returned_all_books: !!checked })
                                }
                            />
                            <Label htmlFor="books" className="text-sm font-medium leading-none cursor-pointer">
                                Sudah mengembalikan semua buku
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="fines"
                                checked={formData.has_paid_fines}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, has_paid_fines: !!checked })
                                }
                            />
                            <Label htmlFor="fines" className="text-sm font-medium leading-none cursor-pointer">
                                Sudah melunasi semua denda
                            </Label>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status Awal</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="request">Request (Menunggu)</SelectItem>
                                <SelectItem value="verified">Verified (Langsung Setujui)</SelectItem>
                                <SelectItem value="rejected">Rejected (Tolak)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit">Simpan Pengajuan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}