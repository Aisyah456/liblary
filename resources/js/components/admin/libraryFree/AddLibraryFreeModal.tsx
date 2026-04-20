import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
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
    // Definisi state form
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

        // Pastikan route 'library-frees.store' sudah terdaftar di Ziggy
        post(route('admin.bebas-pustaka.store'), {
            preserveScroll: true,
            forceFormData: true, 
            onSuccess: () => handleClose(),
        });
    };

    const filteredMajors = (majors || []).filter(
        (major) => major.faculty_id === Number(data.faculty_id)
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-162.5 max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pengajuan Bebas Pustaka</DialogTitle>
                    <DialogDescription>
                        Lengkapi formulir di bawah ini untuk memulai proses verifikasi bebas pustaka.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-2">
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
                            {errors.full_name && <p className="text-[10px] text-destructive">{errors.full_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nim">NIM</Label>
                            <Input
                                id="nim"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                placeholder="Nomor Induk Mahasiswa"
                            />
                            {errors.nim && <p className="text-[10px] text-destructive">{errors.nim}</p>}
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
                            {errors.email && <p className="text-[10px] text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">No. WhatsApp</Label>
                            <Input
                                id="phone"
                                value={data.phone_number}
                                onChange={(e) => setData("phone_number", e.target.value)}
                                placeholder="0812..."
                            />
                            {errors.phone_number && <p className="text-[10px] text-destructive">{errors.phone_number}</p>}
                        </div>
                    </div>

                    {/* Akademik */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fakultas</Label>
                            <Select
                                value={data.faculty_id}
                                onValueChange={(value) => {
                                    setData(d => ({ ...d, faculty_id: value, major_id: "" }));
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
                            {errors.faculty_id && <p className="text-[10px] text-destructive">{errors.faculty_id}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Program Studi</Label>
                            <Select
                                value={data.major_id}
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
                            {errors.major_id && <p className="text-[10px] text-destructive">{errors.major_id}</p>}
                        </div>
                    </div>

                    {/* Data Lulus & Keperluan */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Jenjang</Label>
                            <Select value={data.degree_level} onValueChange={(v) => setData("degree_level", v)}>
                                <SelectTrigger><SelectValue placeholder="Jenjang" /></SelectTrigger>
                                <SelectContent>
                                    {['D3', 'S1', 'S2', 'S3'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.degree_level && <p className="text-[10px] text-destructive">{errors.degree_level}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Thn Masuk</Label>
                            <Input type="number" value={data.entry_year} onChange={e => setData("entry_year", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Thn Lulus</Label>
                            <Input type="number" value={data.graduation_year} onChange={e => setData("graduation_year", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Keperluan</Label>
                        <Select value={data.purpose} onValueChange={(v) => setData("purpose", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Keperluan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wisuda">Persyaratan Wisuda</SelectItem>
                                <SelectItem value="Pindah">Pindah Kuliah</SelectItem>
                                <SelectItem value="Pengambilan Ijazah">Pengambilan Ijazah</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Uploads */}
                    <div className="grid gap-3 p-3 border rounded-lg bg-slate-50">
                        <div className="grid gap-1">
                            <Label htmlFor="paper" className="text-xs font-semibold">File Karya Ilmiah (PDF)</Label>
                            <Input id="paper" type="file" accept=".pdf" onChange={(e) => setData("scientific_paper", e.target.files?.[0] || null)} />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="ktm" className="text-xs font-semibold">Scan KTM (JPG/PNG/PDF)</Label>
                            <Input id="ktm" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData("ktm_scan", e.target.files?.[0] || null)} />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="proof" className="text-xs font-semibold">Bukti Upload Repositori (Opsional)</Label>
                            <Input id="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData("upload_proof", e.target.files?.[0] || null)} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Mengirim..." : "Kirim Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}