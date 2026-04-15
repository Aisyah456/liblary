import { useForm } from "@inertiajs/react";
import { Percent, FileCheck, Info, Loader2 } from "lucide-react";
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
import { route } from "ziggy-js"; // Pastikan import ziggy dengan benar

interface ProcessTurnitinModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: TurnitinSubmission | null;
}

export default function ProcessTurnitinModal({ isOpen, onClose, submission }: ProcessTurnitinModalProps) {
    // Sinkronkan nama field dengan yang ada di controller Laravel Anda
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        submission_id: "",
        similarity_percentage: "",
        status: "" as "pending" | "processing" | "completed" | "rejected" | "",
        admin_notes: "",
        result_file: null as File | null,
    });

    useEffect(() => {
        if (submission && isOpen) {
            setData({
                submission_id: submission.id.toString(),
                similarity_percentage: submission.similarity_percentage?.toString() || "",
                status: submission.status || "processing",
                admin_notes: submission.admin_notes || "",
                result_file: null, // File selalu reset saat buka modal
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

        // Pastikan route 'turnitin.results.store' sudah benar di web.php Laravel
        post(route('turnitin.results.store'), {
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <FileCheck className="h-5 w-5 text-teal-600" />
                        Proses Hasil Turnitin
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Update status dan unggah hasil pengecekan untuk: <br />
                        <span className="font-semibold text-indigo-600 italic">"{submission?.title}"</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Similarity Percentage */}
                        <div className="space-y-1">
                            <Label htmlFor="similarity_percentage">Similarity (%)</Label>
                            <div className="relative">
                                <Input
                                    id="similarity_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                    value={data.similarity_percentage}
                                    onChange={(e) => setData("similarity_percentage", e.target.value)}
                                    className={`pr-8 ${errors.similarity_percentage ? 'border-red-500' : ''}`}
                                    required={data.status === 'completed'}
                                />
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.similarity_percentage && <p className="text-[10px] text-red-500">{errors.similarity_percentage}</p>}
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-1">
                            <Label htmlFor="status">Update Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) => setData("status", value)}
                                required
                            >
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="processing">Sedang Diproses</SelectItem>
                                    <SelectItem value="completed">Selesai (Completed)</SelectItem>
                                    <SelectItem value="rejected">Ditolak (Rejected)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-[10px] text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    {/* Result File Upload */}
                    <div className="space-y-1">
                        <Label htmlFor="result_file">Upload File Hasil (PDF)</Label>
                        <Input
                            id="result_file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData("result_file", e.target.files ? e.target.files[0] : null)}
                            // File hanya wajib diisi jika status diubah ke 'completed'
                            required={data.status === 'completed' && !submission?.result_file_path}
                        />
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <Info className="h-3 w-3" /> File hasil Turnitin akan tersimpan di disk privat.
                        </p>
                        {errors.result_file && <p className="text-[10px] text-red-500">{errors.result_file}</p>}
                    </div>

                    {/* Admin Notes */}
                    <div className="space-y-1">
                        <Label htmlFor="admin_notes">Catatan Admin / Alasan Penolakan</Label>
                        <Textarea
                            id="admin_notes"
                            placeholder="Contoh: File rusak atau lampiran tidak sesuai..."
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            className={`h-24 resize-none ${errors.admin_notes ? 'border-red-500' : ''}`}
                        />
                        {errors.admin_notes && <p className="text-[10px] text-red-500">{errors.admin_notes}</p>}
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : "Update Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}