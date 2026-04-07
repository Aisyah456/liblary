import { useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import type { Student } from "@/components/admin/student/columns";
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

// Definisikan Interface untuk data dari Database
interface Faculty {
    id: number;
    name: string;
    code: string;
}

interface Major {
    id: number;
    faculty_id: number;
    name: string;
    code: string;
}

interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
    faculties: Faculty[]; // Tambahkan props ini
    majors: Major[];     // Tambahkan props ini
}

export default function EditStudentModal({
    isOpen,
    onClose,
    student,
    faculties = [],
    majors = [],
}: EditStudentModalProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        nim: "",
        program_studi: "",
        fakultas: "",
        faculty_id: "", // Tambahan helper filter
        angkatan: "",
        no_telp: "",
        alamat: "",
        max_pinjam: 3,
        status: "Aktif",
    });

    // Sinkronisasi data saat student berubah atau modal dibuka
    useEffect(() => {
        if (isOpen && student) {
            // Cari ID fakultas berdasarkan nama fakultas yang ada di data student
            const initialFaculty = faculties.find(f => f.name === student.fakultas);

            setData({
                name: student.user?.name || "",
                nim: student.nim || "",
                program_studi: student.program_studi || "",
                fakultas: student.fakultas || "",
                faculty_id: initialFaculty ? initialFaculty.id.toString() : "",
                angkatan: student.angkatan?.toString() || "",
                no_telp: student.no_telp || "",
                alamat: student.alamat || "",
                max_pinjam: student.max_pinjam || 3,
                status: student.status || "Aktif",
            });
        }
    }, [isOpen, student, faculties]);

    // Filter Major berdasarkan fakultas yang dipilih
    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        return majors.filter(major => major.faculty_id.toString() === data.faculty_id);
    }, [data.faculty_id, majors]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!student) return;

        put(`/student/${student.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Data Mahasiswa</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi profil dan status perpustakaan mahasiswa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nama Lengkap</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                disabled={processing}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-nim">NIM</Label>
                            <Input
                                id="edit-nim"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nim && <p className="text-xs text-destructive">{errors.nim}</p>}
                        </div>
                    </div>

                    {/* BARIS FAKULTAS & PRODI DINAMIS */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Fakultas */}
                        <div className="space-y-2">
                            <Label>Fakultas</Label>
                            <Select
                                value={data.faculty_id}
                                onValueChange={(val) => {
                                    const facultyName = faculties.find(f => f.id.toString() === val)?.name;
                                    setData(d => ({
                                        ...d,
                                        faculty_id: val,
                                        fakultas: facultyName || "",
                                        program_studi: ""
                                    }));
                                }}
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Fakultas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {faculties.map((f) => (
                                        <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fakultas && <p className="text-xs text-destructive">{errors.fakultas}</p>}
                        </div>

                        {/* Program Studi */}
                        <div className="space-y-2">
                            <Label>Program Studi</Label>
                            <Select
                                value={data.program_studi}
                                onValueChange={(val) => setData("program_studi", val)}
                                disabled={processing || !data.faculty_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Prodi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredMajors.map((m) => (
                                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_studi && <p className="text-xs text-destructive">{errors.program_studi}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-angkatan">Angkatan</Label>
                            <Input
                                id="edit-angkatan"
                                type="number"
                                value={data.angkatan}
                                onChange={(e) => setData("angkatan", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-telp">No. Telepon</Label>
                            <Input
                                id="edit-telp"
                                value={data.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status Mahasiswa</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) => setData("status", value)}
                                disabled={processing}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Aktif">Aktif</SelectItem>
                                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                                    <SelectItem value="Lulus">Lulus</SelectItem>
                                    <SelectItem value="Cuti">Cuti</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-max">Limit Pinjam Buku</Label>
                            <Input
                                id="edit-max"
                                type="number"
                                value={data.max_pinjam}
                                onChange={(e) => setData("max_pinjam", parseInt(e.target.value) || 0)}
                                disabled={processing}
                            />
                        </div>
                    </div>

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