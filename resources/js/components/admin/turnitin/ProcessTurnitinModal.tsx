import { useForm } from '@inertiajs/react';
import { Percent, FileCheck, Info, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { TurnitinSubmission } from '@/pages/admin/Turnitin/Submission';

interface ProcessTurnitinModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: TurnitinSubmission | null;
}

/**
 * Simpan hasil untuk model Submission (tabel submissions) —
 * route: admin.turnitin.results.store → SubmissionController@storeResult
 */
export default function ProcessTurnitinModal({ isOpen, onClose, submission }: ProcessTurnitinModalProps) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        submission_id: '',
        similarity_percentage: '',
        check_date: new Date().toISOString().split('T')[0],
        librarian_notes: '',
        verdict: '',
        evidence_file: null as File | null,
    });

    useEffect(() => {
        if (submission && isOpen) {
            setData({
                submission_id: submission.id.toString(),
                similarity_percentage: submission.result?.similarity_percentage?.toString() ?? '',
                check_date: submission.result?.check_date ?? new Date().toISOString().split('T')[0],
                librarian_notes: submission.result?.librarian_notes ?? '',
                verdict: submission.result?.verdict ?? '',
                evidence_file: null,
            });
        }
    }, [submission, isOpen, setData]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.turnitin.results.store'), {
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-indigo-700 font-bold">
                        <FileCheck className="h-5 w-5" />
                        Input Hasil Pengecekan
                    </DialogTitle>
                    <DialogDescription className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 mt-2">
                        <div className="flex flex-col gap-1 text-slate-700">
                            <span className="text-[10px] font-bold uppercase text-indigo-400 leading-none">Pengajuan</span>
                            <span className="font-semibold line-clamp-2 leading-tight text-indigo-900">{submission?.title}</span>
                            <span className="text-[11px] text-slate-500">
                                ID: {submission?.identifier_id} — {submission?.full_name}
                            </span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="similarity_percentage">Similarity (%)</Label>
                            <div className="relative">
                                <Input
                                    id="similarity_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    value={data.similarity_percentage}
                                    onChange={(e) => setData('similarity_percentage', e.target.value)}
                                    className={`pr-8 ${errors.similarity_percentage ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    required
                                />
                                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.similarity_percentage && (
                                <p className="text-[11px] text-red-500 font-medium">{errors.similarity_percentage}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="check_date">Tanggal Cek</Label>
                            <Input
                                id="check_date"
                                type="date"
                                value={data.check_date}
                                onChange={(e) => setData('check_date', e.target.value)}
                                className={errors.check_date ? 'border-red-500' : ''}
                                required
                            />
                            {errors.check_date && <p className="text-[11px] text-red-500 font-medium">{errors.check_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="verdict">Keputusan</Label>
                        <Select value={data.verdict} onValueChange={(value) => setData('verdict', value)}>
                            <SelectTrigger className={errors.verdict ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Pilih hasil verifikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lulus">Lulus</SelectItem>
                                <SelectItem value="Revisi">Revisi</SelectItem>
                                <SelectItem value="Ditolak">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.verdict && <p className="text-[11px] text-red-500 font-medium">{errors.verdict}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="librarian_notes" className="flex items-center gap-1">
                            <Info className="h-3 w-3" /> Catatan pustakawan
                        </Label>
                        <Textarea
                            id="librarian_notes"
                            placeholder="Opsional"
                            value={data.librarian_notes}
                            onChange={(e) => setData('librarian_notes', e.target.value)}
                            className="h-20 resize-none text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 p-3 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                        <Label htmlFor="evidence_file" className="text-xs font-bold text-slate-600">
                            Bukti hasil (wajib)
                        </Label>
                        <Input
                            id="evidence_file"
                            type="file"
                            accept=".pdf,image/png,image/jpeg"
                            onChange={(e) => setData('evidence_file', e.target.files ? e.target.files[0] : null)}
                            className="bg-white"
                            required
                        />
                        {errors.evidence_file && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.evidence_file}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-4 flex gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Hasil'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
