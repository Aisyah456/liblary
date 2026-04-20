import { useForm } from "@inertiajs/react";
import { Percent, FileCheck, Info, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { route } from "ziggy-js";
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
import { Textarea } from "@/components/ui/textarea";

import type { TurnitinSubmission } from "@/pages/admin/Turnitin/TurnitinProcess";

interface ProcessTurnitinModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: TurnitinSubmission | null;
    // onUpdate biasanya tidak diperlukan jika menggunakan Inertia karena data otomatis refresh dari server
}

export default function ProcessTurnitinModal({ isOpen, onClose, submission }: ProcessTurnitinModalProps) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        submission_id: "",
        similarity_percentage: "",
        check_date: new Date().toISOString().split('T')[0],
        librarian_notes: "",
        verdict: "",
        evidence_file: null as File | null,
    });

    // Sinkronisasi data saat modal dibuka
    useEffect(() => {
        if (submission && isOpen) {
            setData({
                submission_id: submission.id.toString(),
                // Jika sudah ada hasil sebelumnya, masukkan ke form (untuk fitur Edit)
                similarity_percentage: submission.result?.similarity_percentage?.toString() || "",
                check_date: submission.result?.check_date || new Date().toISOString().split('T')[0],
                librarian_notes: submission.result?.librarian_notes || "",
                verdict: submission.result?.verdict || "",
                evidence_file: null,
            });
        }
    }, [submission, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.turnitin.results.store_direct'), {
            forceFormData: true,
            onSuccess: () => {
                handleClose();

            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-indigo-700 font-bold">
                        <FileCheck className="h-5 w-5" />
                        Input Hasil Pengecekan
                    </DialogTitle>
                    <DialogDescription className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 mt-2">
                        <div className="flex flex-col gap-1 text-slate-700">
                            <span className="text-[10px] font-bold uppercase text-indigo-400 leading-none">Dokumen Mahasiswa</span>
                            <span className="font-semibold line-clamp-2 leading-tight text-indigo-900">{submission?.title}</span>
                            <span className="text-[11px] text-slate-500">ID: {submission?.identifier_id} — {submission?.full_name}</span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Persentase Similarity */}
                        <div className="space-y-1.5">
                            <Label htmlFor="similarity_percentage">Similarity</Label>
                            <div className="relative">
                                <Input
                                    id="similarity_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    value={data.similarity_percentage}
                                    onChange={(e) => setData("similarity_percentage", e.target.value)}
                                    className={`pr-8 ${errors.similarity_percentage ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    required
                                />
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.similarity_percentage && <p className="text-[11px] text-red-500 font-medium">{errors.similarity_percentage}</p>}
                        </div>

                        {/* Tanggal Pengecekan */}
                        <div className="space-y-1.5">
                            <Label htmlFor="check_date">Tanggal Cek</Label>
                            <Input
                                id="check_date"
                                type="date"
                                value={data.check_date}
                                onChange={(e) => setData("check_date", e.target.value)}
                                className={errors.check_date ? "border-red-500" : ""}
                                required
                            />
                            {errors.check_date && <p className="text-[11px] text-red-500 font-medium">{errors.check_date}</p>}
                        </div>
                    </div>

                    {/* Keputusan / Verdict */}
                    <div className="space-y-1.5">
                        <Label htmlFor="verdict">Status Kelulusan</Label>
                        <Select
                            value={data.verdict}
                            onValueChange={(value) => setData("verdict", value)}
                        >
                            <SelectTrigger className={errors.verdict ? "border-red-500" : ""}>
                                <SelectValue placeholder="Pilih hasil verifikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lulus">Lulus (Memenuhi Syarat)</SelectItem>
                                <SelectItem value="Revisi">Perlu Revisi (Similarity Tinggi)</SelectItem>
                                <SelectItem value="Ditolak">Ditolak (Plagiasi Terdeteksi)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.verdict && <p className="text-[11px] text-red-500 font-medium">{errors.verdict}</p>}
                    </div>

                    {/* Catatan Pustakawan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="librarian_notes" className="flex items-center gap-1">
                            <Info className="h-3 w-3" /> Catatan Pustakawan
                        </Label>
                        <Textarea
                            id="librarian_notes"
                            placeholder="Opsional: Tambahkan catatan jika ada bagian yang perlu diperhatikan..."
                            value={data.librarian_notes}
                            onChange={(e) => setData("librarian_notes", e.target.value)}
                            className="h-20 resize-none text-sm"
                        />
                    </div>

                    {/* Upload Bukti Hasil */}
                    <div className="space-y-1.5 p-3 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                        <Label htmlFor="evidence_file" className="text-xs font-bold text-slate-600">
                            Upload Bukti (PDF / Screenshot Hasil)
                        </Label>
                        <Input
                            id="evidence_file"
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => setData("evidence_file", e.target.files ? e.target.files[0] : null)}
                            className="bg-white"
                            // Required hanya jika data result belum ada (pengajuan baru)
                            required={!submission?.result}
                        />
                        <p className="text-[10px] text-slate-400">File maks. 5MB. Format: PDF, JPG, PNG.</p>
                        {errors.evidence_file && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.evidence_file}</p>}
                    </div>

                    <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
                        <span className="text-[10px] text-slate-400 hidden sm:flex items-center">
                            Aksi ini akan memperbarui status ke "Completed"
                        </span>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                                className="flex-1 sm:flex-none"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 flex-1 sm:flex-none"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : "Simpan Hasil"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}