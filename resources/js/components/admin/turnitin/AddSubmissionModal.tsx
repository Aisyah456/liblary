import { useForm } from "@inertiajs/react";
import { useState } from "react";
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

        post("/admin/turnitin/submissions", {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true, // Wajib true karena mengunggah file
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Pengajuan Turnitin</DialogTitle>
                    <DialogDescription>
                        Input data karya ilmiah mahasiswa atau dosen untuk antrean pengecekan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Nama Lengkap */}
                    <div className="space-y-1">
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                            id="full_name"
                            placeholder="Contoh: Andi Wijaya"
                            value={data.full_name}
                            onChange={(e) => setData("full_name", e.target.value)}
                            required
                        />
                        {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
                    </div>

                    {/* NIM / NIDN */}
                    <div className="space-y-1">
                        <Label htmlFor="identifier_id">NIM / NIDN</Label>
                        <Input
                            id="identifier_id"
                            placeholder="Masukkan nomor identitas"
                            value={data.identifier_id}
                            onChange={(e) => setData("identifier_id", e.target.value)}
                            required
                        />
                        {errors.identifier_id && <p className="text-xs text-red-500">{errors.identifier_id}</p>}
                    </div>

                    {/* Judul Karya */}
                    <div className="space-y-1">
                        <Label htmlFor="title">Judul Karya Ilmiah</Label>
                        <Input
                            id="title"
                            placeholder="Masukkan judul lengkap"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                        />
                    </div>

                    {/* Jenis Dokumen */}
                    <div className="space-y-1">
                        <Label htmlFor="document_type">Jenis Dokumen</Label>
                        <Select
                            onValueChange={(value) => setData("document_type", value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis dokumen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Skripsi">Skripsi</SelectItem>
                                <SelectItem value="Tesis">Tesis</SelectItem>
                                <SelectItem value="Artikel">Artikel Jurnal</SelectItem>
                            </SelectContent>
                        </Select>
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
                        {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
                    </div>

                    <DialogFooter className="pt-4">
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={processing}
                        >
                            {processing ? "Mengunggah..." : "Kirim Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}