import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
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
import { route } from "ziggy-js";

// Interface untuk data Major (Prodi) yang biasanya dilempar dari controller
interface Major {
    id: number;
    name: string;
}

interface AddSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    majors: Major[]; // Tambahkan props majors untuk dropdown prodi
}

export default function AddSubmissionModal({ isOpen, onClose, majors }: AddSubmissionModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: "",
        identifier_id: "",
        email: "",
        major_id: "",
        title: "",
        document_type: "",
        academic_year: "",
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.turnitin.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Pengajuan Turnitin</DialogTitle>
                    <DialogDescription>
                        Input data pengaju dan dokumen untuk antrean pengecekan Turnitin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Identitas (NIM/NIDN) */}
                        <div className="space-y-1">
                            <Label htmlFor="identifier_id">NIM / NIDN / NIK</Label>
                            <Input
                                id="identifier_id"
                                placeholder="Nomor Identitas"
                                value={data.identifier_id}
                                onChange={(e) => setData("identifier_id", e.target.value)}
                                required
                            />
                            {errors.identifier_id && <p className="text-[11px] text-red-500">{errors.identifier_id}</p>}
                        </div>

                        {/* Program Studi (major_id) */}
                        <div className="space-y-1">
                            <Label htmlFor="major_id">Program Studi</Label>
                            <Select onValueChange={(value) => setData("major_id", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Prodi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {majors.map((major) => (
                                        <SelectItem key={major.id} value={major.id.toString()}>
                                            {major.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.major_id && <p className="text-[11px] text-red-500">{errors.major_id}</p>}
                        </div>
                    </div>

                    {/* Nama Lengkap */}
                    <div className="space-y-1">
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                            id="full_name"
                            placeholder="Nama Lengkap sesuai Identitas"
                            value={data.full_name}
                            onChange={(e) => setData("full_name", e.target.value)}
                            required
                        />
                        {errors.full_name && <p className="text-[11px] text-red-500">{errors.full_name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@mhs.umht.ac.id"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                    </div>

                    {/* Judul Karya */}
                    <div className="space-y-1">
                        <Label htmlFor="title">Judul Karya Ilmiah</Label>
                        <Input
                            id="title"
                            placeholder="Masukkan judul lengkap dokumen"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Jenis Dokumen */}
                        <div className="space-y-1">
                            <Label htmlFor="document_type">Jenis Dokumen</Label>
                            <Select onValueChange={(value) => setData("document_type", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Jenis Dokumen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Skripsi">Skripsi</SelectItem>
                                    <SelectItem value="Tesis">Tesis</SelectItem>
                                    <SelectItem value="KTI">KTI</SelectItem>
                                    <SelectItem value="Artikel">Artikel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tahun Akademik */}
                        <div className="space-y-1">
                            <Label htmlFor="academic_year">Tahun Akademik</Label>
                            <Input
                                id="academic_year"
                                placeholder="Contoh: 2025/2026"
                                value={data.academic_year}
                                onChange={(e) => setData("academic_year", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Upload File */}
                    <div className="space-y-1">
                        <Label htmlFor="file">File Dokumen (PDF/Docx)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setData("file", e.target.files ? e.target.files[0] : null)}
                            required
                            className="cursor-pointer"
                        />
                        {errors.file && <p className="text-[11px] text-red-500">{errors.file}</p>}
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                            disabled={processing}
                        >
                            {processing ? "Mengirim..." : "Simpan Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}