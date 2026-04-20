import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner"; // Opsional jika Anda pakai sonner
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MemberCandidate {
    id: number;
    nama_lengkap?: string; // Untuk Lecturer
    user?: { name: string }; // Untuk Student
    nim?: string;
    nidn?: string;
}

interface Props {
    availableMembers: {
        students: MemberCandidate[];
        lecturers: MemberCandidate[];
    };
}

export default function AddMembershipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // Ambil data kandidat dari props Inertia
    const { availableMembers } = usePage<any>().props as Props;

    const [formData, setFormData] = useState({
        library_card_number: "",
        memberable_type: "App\\Models\\Student",
        memberable_id: "",
        status: "Aktif",
        joined_at: new Date().toISOString().split('T')[0],
        expires_at: "",
    });

    // Pilih daftar kandidat berdasarkan tipe yang dipilih
    const candidates = formData.memberable_type === "App\\Models\\Student"
        ? availableMembers.students
        : availableMembers.lecturers;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/memberships', formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    library_card_number: "",
                    memberable_type: "App\\Models\\Student",
                    memberable_id: "",
                    status: "Aktif",
                    joined_at: new Date().toISOString().split('T')[0],
                    expires_at: "",
                });
            },
            onError: (errors) => {
                // Handle error validasi dari Laravel (misal: library_card_number sudah ada)
                Object.values(errors).forEach(err => console.error(err));
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Daftarkan Anggota Baru</DialogTitle>
                    <DialogDescription>
                        Pilih mahasiswa atau dosen yang belum memiliki kartu anggota.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Tipe Anggota */}
                    <div className="space-y-2">
                        <Label>Jenis Anggota</Label>
                        <Select
                            value={formData.memberable_type}
                            onValueChange={(val) => setFormData({ ...formData, memberable_type: val, memberable_id: "" })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="App\\Models\\Student">Mahasiswa</SelectItem>
                                <SelectItem value="App\\Models\\Lecturer">Dosen</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pilih Nama Anggota */}
                    <div className="space-y-2">
                        <Label>Pilih Orang</Label>
                        <Select
                            value={formData.memberable_id}
                            onValueChange={(val) => setFormData({ ...formData, memberable_id: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={candidates.length > 0 ? "Pilih nama..." : "Tidak ada data tersedia"} />
                            </SelectTrigger>
                            <SelectContent>
                                {candidates.map((m) => (
                                    <SelectItem key={m.id} value={m.id.toString()}>
                                        {m.nama_lengkap || m.user?.name} ({m.nim || m.nidn})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nomor Kartu */}
                    <div className="space-y-2">
                        <Label>Nomor Kartu Perpustakaan</Label>
                        <Input
                            placeholder="Contoh: LIB-2024-001"
                            value={formData.library_card_number}
                            onChange={(e) => setFormData({ ...formData, library_card_number: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tanggal Gabung</Label>
                            <Input
                                type="date"
                                value={formData.joined_at}
                                onChange={(e) => setFormData({ ...formData, joined_at: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Masa Berlaku</Label>
                            <Input
                                type="date"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={!formData.memberable_id}>Simpan Keanggotaan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}