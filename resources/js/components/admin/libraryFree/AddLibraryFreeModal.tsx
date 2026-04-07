import { useForm } from "@inertiajs/react";
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
    SelectValue
} from "@/components/ui/select";

interface Faculty {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
    faculty_id: number;
}

interface LibraryFreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    faculties: Faculty[];
    majors: Major[];
}

export default function AddLibraryFreeModal({
    isOpen,
    onClose,
    faculties,
    majors,
}: LibraryFreeModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        full_name: "",
        nim: "",
        phone_number: "",
        email: "",
        faculty_id: "",
        major_id: "",
        degree_level: "",
        purpose: "",
        entry_year: new Date().getFullYear().toString(),
        graduation_year: new Date().getFullYear().toString(),
        scientific_paper: null as File | null,
        ktm_scan: null as File | null,
        upload_proof: null as File | null,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirimkan data sebagai multipart/form-data otomatis oleh Inertia karena ada File
        post('/library-frees', {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    // Filter jurusan berdasarkan fakultas yang dipilih
    const filteredMajors = (majors || []).filter(
        (major) => major.faculty_id === Number(data.faculty_id)
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pengajuan Bebas Pustaka</DialogTitle>
                    <DialogDescription>
                        Lengkapi formulir di bawah ini untuk memulai proses verifikasi bebas pustaka.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Informasi Dasar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Nama Lengkap</Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => setData("full_name", e.target.value)}
                                placeholder="Nama sesuai KTM"
                            />
                            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nim">NIM</Label>
                            <Input
                                id="nim"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                placeholder="Nomor Induk Mahasiswa"
                            />
                            {errors.nim && <p className="text-xs text-destructive">{errors.nim}</p>}
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="Email aktif"
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">No. WhatsApp</Label>
                            <Input
                                id="phone"
                                value={data.phone_number}
                                onChange={(e) => setData("phone_number", e.target.value)}
                                placeholder="0812..."
                            />
                            {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number}</p>}
                        </div>
                    </div>

                    {/* Akademik */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fakultas</Label>
                            <Select
                                onValueChange={(value) => {
                                    setData("faculty_id", value);
                                    setData("major_id", ""); // Reset jurusan jika fakultas ganti
                                }}
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
                            {errors.faculty_id && <p className="text-xs text-destructive">{errors.faculty_id}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Program Studi</Label>
                            <Select
                                disabled={!data.faculty_id}
                                onValueChange={(value) => setData("major_id", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredMajors.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.major_id && <p className="text-xs text-destructive">{errors.major_id}</p>}
                        </div>
                    </div>

                    {/* Data Lulus */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Jenjang</Label>
                            <Select onValueChange={(v) => setData("degree_level", v)}>
                                <SelectTrigger><SelectValue placeholder="Jenjang" /></SelectTrigger>
                                <SelectContent>
                                    {['D3', 'S1', 'S2', 'S3'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Tahun Masuk</Label>
                            <Input type="number" value={data.entry_year} onChange={e => setData("entry_year", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tahun Lulus</Label>
                            <Input type="number" value={data.graduation_year} onChange={e => setData("graduation_year", e.target.value)} />
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid gap-4 p-4 border rounded-lg bg-muted/30">
                        <div className="grid gap-2">
                            <Label htmlFor="paper">File Karya Ilmiah (PDF)</Label>
                            <Input
                                id="paper"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setData("scientific_paper", e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.scientific_paper && <p className="text-xs text-destructive">{errors.scientific_paper}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ktm">Scan KTM (Gambar/PDF)</Label>
                            <Input
                                id="ktm"
                                type="file"
                                onChange={(e) => setData("ktm_scan", e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.ktm_scan && <p className="text-xs text-destructive">{errors.ktm_scan}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Mengunggah Data..." : "Ajukan Bebas Pustaka"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}