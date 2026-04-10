import { useForm } from "@inertiajs/react";
import { Percent, FileCheck, Info } from "lucide-react";
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
}

export default function ProcessTurnitinModal({ isOpen, onClose, submission }: ProcessTurnitinModalProps) {
    // Definisi form disesuaikan dengan kolom di database
    const { data, setData, post, processing, reset, errors } = useForm({
        _method: 'PATCH', // Menggunakan spoofing method karena Laravel PATCH sering bermasalah dengan FormData
        similarity_percentage: "" as string | number,
        status: "" as 'pending' | 'processing' | 'completed' | 'rejected',
        admin_notes: "",
        result_file: null as File | null,
    });

    // Sinkronisasi data awal jika submission sudah memiliki hasil sebelumnya
    useEffect(() => {
        if (submission) {
            setData({
                ...data,
                similarity_percentage: submission.similarity_percentage ?? "",
                status: submission.status,
                admin_notes: submission.admin_notes ?? "",
            });
        }
    }, [submission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Pastikan endpoint sesuai dengan route controller Anda
        post(route('admin.turnitin.update', submission?.id), {
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
                        {/* Persentase Similarity (similarity_percentage) */}
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
                                    className="pr-8"
                                    required={data.status === 'completed'}
                                />
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.similarity_percentage && <p className="text-xs text-red-500">{errors.similarity_percentage}</p>}
                        </div>

                        {/* Workflow Status (status) */}
                        <div className="space-y-1">
                            <Label htmlFor="status">Update Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) => setData("status", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="processing">Sedang Diproses</SelectItem>
                                    <SelectItem value="completed">Selesai (Completed)</SelectItem>
                                    <SelectItem value="rejected">Ditolak (Rejected)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    {/* Upload Hasil PDF (result_file_path) */}
                    <div className="space-y-1">
                        <Label htmlFor="result_file">Upload File Hasil (PDF)</Label>
                        <Input
                            id="result_file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData("result_file", e.target.files ? e.target.files[0] : null)}
                            required={data.status === 'completed'}
                        />
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <Info className="h-3 w-3" /> File hasil Turnitin akan dapat diunduh oleh pengaju.
                        </p>
                        {errors.result_file && <p className="text-xs text-red-500">{errors.result_file}</p>}
                    </div>

                    {/* Catatan Admin (admin_notes) */}
                    <div className="space-y-1">
                        <Label htmlFor="admin_notes">Catatan Admin / Alasan Penolakan</Label>
                        <Textarea
                            id="admin_notes"
                            placeholder="Tambahkan catatan atau alasan jika pengajuan ditolak..."
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            className="h-24 resize-none"
                        />
                        {errors.admin_notes && <p className="text-xs text-red-500">{errors.admin_notes}</p>}
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
                            {processing ? "Memperbarui..." : "Update Pengajuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function route(arg0: string, id: number | undefined): string {
    throw new Error("Function not implemented.");
}
