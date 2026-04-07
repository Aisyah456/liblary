import { useForm } from "@inertiajs/react";
import { Percent, FileCheck, Calendar as CalendarIcon } from "lucide-react";
import { useEffect } from "react";
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
import type { TurnitinSubmission } from "./columns";

interface ProcessTurnitinModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: TurnitinSubmission | null;
    onUpdate: (updated: TurnitinSubmission) => void;
}

export default function ProcessTurnitinModal({ isOpen, onClose, submission, onUpdate }: ProcessTurnitinModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        submission_id: "",
        similarity_percentage: "",
        check_date: new Date().toISOString().split('T')[0],
        librarian_notes: "",
        verdict: "", // Lulus / Revisi / Ditolak
        evidence_file: null as File | null,
    });

    // Sinkronisasi data saat submission terpilih berganti
    useEffect(() => {
        if (submission) {
            setData("submission_id", submission.id.toString());
        }
    }, [submission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/turnitin/results", {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-indigo-600" />
                        Input Hasil Turnitin
                    </DialogTitle>
                    <DialogDescription>
                        Masukkan detail hasil pengecekan untuk: <br />
                        <span className="font-semibold text-slate-900">{submission?.title}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Persentase Similarity */}
                        <div className="space-y-1">
                            <Label htmlFor="similarity_percentage">Persentase Similarity</Label>
                            <div className="relative">
                                <Input
                                    id="similarity_percentage"
                                    type="number"
                                    placeholder="Contoh: 15"
                                    value={data.similarity_percentage}
                                    onChange={(e) => setData("similarity_percentage", e.target.value)}
                                    className="pr-8"
                                    required
                                />
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.similarity_percentage && <p className="text-xs text-red-500">{errors.similarity_percentage}</p>}
                        </div>

                        {/* Tanggal Pengecekan */}
                        <div className="space-y-1">
                            <Label htmlFor="check_date">Tanggal Pengecekan</Label>
                            <div className="relative">
                                <Input
                                    id="check_date"
                                    type="date"
                                    value={data.check_date}
                                    onChange={(e) => setData("check_date", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Keputusan / Verdict */}
                    <div className="space-y-1">
                        <Label htmlFor="verdict">Status Kelulusan</Label>
                        <Select onValueChange={(value) => setData("verdict", value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih hasil keputusan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lulus">Lulus (Di bawah ambang batas)</SelectItem>
                                <SelectItem value="Revisi">Revisi (Similarity tinggi)</SelectItem>
                                <SelectItem value="Ditolak">Ditolak (Indikasi kecurangan)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Catatan Pustakawan */}
                    <div className="space-y-1">
                        <Label htmlFor="librarian_notes">Catatan Pustakawan</Label>
                        <Textarea
                            id="librarian_notes"
                            placeholder="Tambahkan catatan jika perlu..."
                            value={data.librarian_notes}
                            onChange={(e) => setData("librarian_notes", e.target.value)}
                            className="h-20"
                        />
                    </div>

                    {/* Upload Bukti Hasil */}
                    <div className="space-y-1">
                        <Label htmlFor="evidence_file">Upload Bukti (PDF / Screenshot)</Label>
                        <Input
                            id="evidence_file"
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => setData("evidence_file", e.target.files ? e.target.files[0] : null)}
                            required
                        />
                        <p className="text-[10px] text-slate-500 italic">*Wajib melampirkan file hasil dari sistem Turnitin.</p>
                        {errors.evidence_file && <p className="text-xs text-red-500">{errors.evidence_file}</p>}
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
                            {processing ? "Menyimpan..." : "Simpan Hasil & Selesaikan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}