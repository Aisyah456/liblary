import { useForm } from "@inertiajs/react";
import { useMemo } from "react";
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

// Interface untuk data master
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

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    faculties: Faculty[];
    majors: Major[];
}

export default function AddStudentModal({
    isOpen,
    onClose,
    faculties = [],
    majors = [],
}: AddStudentModalProps) {
    // Form state untuk penambahan data baru
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "", // Penting untuk User account
        nim: "",
        program_studi: "",
        fakultas: "",
        faculty_id: "", // Helper filter
        angkatan: new Date().getFullYear().toString(),
        no_telp: "",
        alamat: "",
        max_pinjam: 3,
        status: "Aktif",
    });

    // Otomatisasi: Filter Major berdasarkan ID fakultas yang dipilih
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
        post('/student', {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi formulir di bawah ini untuk menambahkan mahasiswa dan akun aksesnya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Baris 1: Nama & Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Nama Lengkap</Label>
                            <Input
                                id="add-name"
                                placeholder="Contoh: John Doe"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                disabled={processing}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-email">Email</Label>
                            <Input
                                id="add-email"
                                type="email"
                                placeholder="john@example.com"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                disabled={processing}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Baris 2: NIM & Angkatan */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-nim">NIM</Label>
                            <Input
                                id="add-nim"
                                placeholder="Masukkan NIM"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                disabled={processing}
                            />
                            {errors.nim && <p className="text-xs text-destructive">{errors.nim}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-angkatan">Angkatan</Label>
                            <Input
                                id="add-angkatan"
                                type="number"
                                value={data.angkatan}
                                onChange={(e) => setData("angkatan", e.target.value)}
                                disabled={processing}
                            />
                            {errors.angkatan && <p className="text-xs text-destructive">{errors.angkatan}</p>}
                        </div>
                    </div>

                    {/* Baris 3: Fakultas & Prodi (Cascading) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fakultas</Label>
                            <Select
                                value={data.faculty_id}
                                onValueChange={(val) => {
                                    const selectedFaculty = faculties.find(f => f.id.toString() === val);
                                    setData(d => ({
                                        ...d,
                                        faculty_id: val,
                                        fakultas: selectedFaculty?.name || "",
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
                                        <SelectItem key={f.id} value={f.id.toString()}>
                                            {f.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fakultas && <p className="text-xs text-destructive">{errors.fakultas}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Program Studi</Label>
                            <Select
                                value={data.program_studi}
                                onValueChange={(val) => setData("program_studi", val)}
                                disabled={processing || !data.faculty_id || filteredMajors.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={data.faculty_id ? "Pilih Prodi" : "Pilih fakultas dulu"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredMajors.map((m) => (
                                        <SelectItem key={m.id} value={m.name}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_studi && <p className="text-xs text-destructive">{errors.program_studi}</p>}
                        </div>
                    </div>

                    {/* Baris 4: No Telp & Limit Pinjam */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-telp">No. Telepon</Label>
                            <Input
                                id="add-telp"
                                placeholder="0812..."
                                value={data.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-max">Limit Pinjam Buku</Label>
                            <Input
                                id="add-max"
                                type="number"
                                value={data.max_pinjam}
                                onChange={(e) => setData("max_pinjam", parseInt(e.target.value) || 0)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-alamat">Alamat</Label>
                        <Textarea
                            id="add-alamat"
                            placeholder="Masukkan alamat lengkap..."
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
                            {processing ? "Menyimpan..." : "Tambah Mahasiswa"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}