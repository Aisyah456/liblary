import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
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

// Sesuaikan interface dengan kolom di table lecturers
interface Lecturer {
    id: number;
    nidn: string;
    nama_lengkap: string;
    email: string;
    jenis_kelamin: "L" | "P";
    program_studi: string;
    jabatan_fungsional?: string | null;
    alamat?: string | null;
    telepon?: string | null;
}

interface EditLecturerModalProps {
    isOpen: boolean;
    onClose: () => void;
    lecturer: Lecturer | null;
    programs?: string[]; // Daftar prodi (opsional)
}

export default function EditLecturerModal({
    isOpen,
    onClose,
    lecturer,
    programs = ["Informatika", "Sistem Informasi", "Teknik Elektro"],
}: EditLecturerModalProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        nidn: "",
        nama_lengkap: "",
        email: "",
        jenis_kelamin: "" as "L" | "P" | "",
        program_studi: "",
        jabatan_fungsional: "",
        alamat: "",
        telepon: "",
    });

    // Sinkronisasi data saat modal dibuka
    useEffect(() => {
        if (isOpen && lecturer) {
            setData({
                nidn: lecturer.nidn || "",
                nama_lengkap: lecturer.nama_lengkap || "",
                email: lecturer.email || "",
                jenis_kelamin: lecturer.jenis_kelamin || "",
                program_studi: lecturer.program_studi || "",
                jabatan_fungsional: lecturer.jabatan_fungsional || "",
                alamat: lecturer.alamat || "",
                telepon: lecturer.telepon || "",
            });
        }
    }, [isOpen, lecturer]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!lecturer) return;

        // Endpoint diarahkan ke resource lecturers
        put(`/lecturers/${lecturer.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Data Dosen</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi data diri dan jabatan fungsional dosen.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Baris 1: NIDN & Nama */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nidn">NIDN</Label>
                            <Input
                                id="edit-nidn"
                                value={data.nidn}
                                onChange={(e) => setData("nidn", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nidn && <p className="text-xs text-destructive">{errors.nidn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-nama">Nama Lengkap</Label>
                            <Input
                                id="edit-nama"
                                value={data.nama_lengkap}
                                onChange={(e) => setData("nama_lengkap", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nama_lengkap && <p className="text-xs text-destructive">{errors.nama_lengkap}</p>}
                        </div>
                    </div>

                    {/* Baris 2: Email & Jenis Kelamin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                disabled={processing}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
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
                        </div>
                    </div>

                    {/* Baris 3: Program Studi & Jabatan */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
                            <Label htmlFor="edit-jabatan">Jabatan Fungsional</Label>
                            <Input
                                id="edit-jabatan"
                                placeholder="Lektor, Asisten Ahli, dll"
                                value={data.jabatan_fungsional}
                                onChange={(e) => setData("jabatan_fungsional", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Baris 4: Telepon */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-telp">Nomor Telepon</Label>
                        <Input
                            id="edit-telp"
                            value={data.telepon}
                            onChange={(e) => setData("telepon", e.target.value)}
                            disabled={processing}
                        />
                    </div>

                    {/* Baris 5: Alamat */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-alamat">Alamat</Label>
                        <Textarea
                            id="edit-alamat"
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                            disabled={processing}
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}