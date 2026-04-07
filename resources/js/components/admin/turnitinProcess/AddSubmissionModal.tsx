import { useForm } from "@inertiajs/react";
import { FileUp, UserCircle, BookOpen } from "lucide-react";
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

interface AddSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddSubmissionModal({ isOpen, onClose }: AddSubmissionModalProps) {
    // Menggunakan Inertia useForm untuk handle file upload dan validasi
    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: "",
        identifier_id: "", // NIM / NIDN
        title: "",
        document_type: "",
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mengarah ke store method pada SubmissionController via Route Resource
        post(route('submissions.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileUp className="h-5 w-5 text-indigo-600" />
                        Tambah Pengajuan Turnitin
                    </DialogTitle>
                    <DialogDescription>
                        Lengkapi formulir di bawah untuk mendaftarkan karya ilmiah ke antrean pengecekan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Nama & ID Section */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="full_name"
                                placeholder="Nama Mahasiswa/Dosen"
                                value={data.full_name}
                                onChange={(e) => setData("full_name", e.target.value)}
                                className={errors.full_name ? "border-red-500" : ""}
                                required
                            />
                            {errors.full_name && <p className="text-[11px] font-medium text-red-500">{errors.full_name}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="identifier_id" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                NIM / NIDN
                            </Label>
                            <Input
                                id="identifier_id"
                                placeholder="Contoh: 201011400..."
                                value={data.identifier_id}
                                onChange={(e) => setData("identifier_id", e.target.value)}
                                className={errors.identifier_id ? "border-red-500" : ""}
                                required
                            />
                            {errors.identifier_id && <p className="text-[11px] font-medium text-red-500">{errors.identifier_id}</p>}
                        </div>
                    </div>

                    {/* Judul Karya */}
                    <div className="space-y-1">
                        <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Judul Karya Ilmiah
                        </Label>
                        <Input
                            id="title"
                            placeholder="Masukkan judul lengkap sesuai dokumen"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className={errors.title ? "border-red-500" : ""}
                            required
                        />
                        {errors.title && <p className="text-[11px] font-medium text-red-500">{errors.title}</p>}
                    </div>

                    {/* Jenis & File Section */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="document_type" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Jenis Dokumen
                            </Label>
                            <Select
                                onValueChange={(value) => setData("document_type", value)}
                                defaultValue={data.document_type}
                                required
                            >
                                <SelectTrigger className={errors.document_type ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Skripsi">Skripsi</SelectItem>
                                    <SelectItem value="Tesis">Tesis</SelectItem>
                                    <SelectItem value="Artikel">Artikel Jurnal</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.document_type && <p className="text-[11px] font-medium text-red-500">{errors.document_type}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="file" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                File Dokumen
                            </Label>
                            <div className="relative">
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setData("file", e.target.files ? e.target.files[0] : null)}
                                    required
                                    className={`cursor-pointer pb-2 pt-1.5 ${errors.file ? "border-red-500" : ""}`}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Maksimal ukuran file: 10MB (PDF, DOC, DOCX)</p>
                            {errors.file && <p className="text-[11px] font-medium text-red-500">{errors.file}</p>}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 sm:w-auto"
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Simpan Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}