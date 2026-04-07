import { useForm } from "@inertiajs/react";
import * as React from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddLecturerModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Anda bisa mempassing list prodi jika datanya dinamis dari database
    programs?: string[];
}

export default function AddLecturerModal({
    isOpen,
    onClose,
    programs = ["Informatika", "Sistem Informasi", "Teknik Elektro", "Teknik Sipil"],
}: AddLecturerModalProps) {

    // Inisialisasi Form sesuai schema table 'lecturers'
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nidn: "",
        nama_lengkap: "",
        email: "",
        jenis_kelamin: "" as "L" | "P" | "",
        program_studi: "",
        jabatan_fungsional: "",
        alamat: "",
        telepon: "",
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lecturers', {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Dosen Baru</DialogTitle>
                    <DialogDescription>
                        Isi data lengkap dosen sesuai dengan identitas resmi (NIDN).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Baris 1: NIDN & Nama Lengkap */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-nidn">NIDN</Label>
                            <Input
                                id="add-nidn"
                                placeholder="Contoh: 0012345678"
                                value={data.nidn}
                                onChange={(e) => setData("nidn", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nidn && <p className="text-xs text-destructive">{errors.nidn}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Nama Lengkap</Label>
                            <Input
                                id="add-name"
                                placeholder="Nama serta gelar"
                                value={data.nama_lengkap}
                                onChange={(e) => setData("nama_lengkap", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nama_lengkap && <p className="text-xs text-destructive">{errors.nama_lengkap}</p>}
                        </div>
                    </div>

                    {/* Baris 2: Email & Jenis Kelamin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-email">Email</Label>
                            <Input
                                id="add-email"
                                type="email"
                                placeholder="dosen@kampus.ac.id"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                disabled={processing}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Jenis Kelamin</Label>
                            <Select
                                value={data.jenis_kelamin}
                                onValueChange={(val: "L" | "P") => setData("jenis_kelamin", val)}
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih L/P" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Laki-laki</SelectItem>
                                    <SelectItem value="P">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kelamin && <p className="text-xs text-destructive">{errors.jenis_kelamin}</p>}
                        </div>
                    </div>

                    {/* Baris 3: Program Studi & Jabatan Fungsional */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Program Studi</Label>
                            <Select
                                value={data.program_studi}
                                onValueChange={(val) => setData("program_studi", val)}
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Prodi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_studi && <p className="text-xs text-destructive">{errors.program_studi}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-jabatan">Jabatan Fungsional</Label>
                            <Input
                                id="add-jabatan"
                                placeholder="Lektor / Asisten Ahli"
                                value={data.jabatan_fungsional}
                                onChange={(e) => setData("jabatan_fungsional", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Baris 4: Nomor Telepon */}
                    <div className="grid gap-2">
                        <Label htmlFor="add-telp">Nomor Telepon</Label>
                        <Input
                            id="add-telp"
                            placeholder="08123456..."
                            value={data.telepon}
                            onChange={(e) => setData("telepon", e.target.value)}
                            disabled={processing}
                        />
                        {errors.telepon && <p className="text-xs text-destructive">{errors.telepon}</p>}
                    </div>

                    {/* Baris 5: Alamat */}
                    <div className="grid gap-2">
                        <Label htmlFor="add-alamat">Alamat</Label>
                        <Textarea
                            id="add-alamat"
                            placeholder="Alamat lengkap domisili..."
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                            disabled={processing}
                            rows={3}
                        />
                        {errors.alamat && <p className="text-xs text-destructive">{errors.alamat}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Tambah Dosen"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}