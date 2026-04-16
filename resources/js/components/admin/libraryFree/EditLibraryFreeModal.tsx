import { useForm } from "@inertiajs/react";
import { FileText, User, ExternalLink, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
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
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface LibraryFree {
    id: number;
    full_name: string;
    nim: string;
    phone_number: string;
    email: string;
    faculty_id: number;
    major_id: number;
    degree_level: string;
    purpose: string;
    entry_year: number | string;
    graduation_year: number | string;
    scientific_paper_path: string;
    ktm_scan_path: string;
    upload_proof_path?: string | null;
    turnitin_similarity_score?: number | string | null;
    turnitin_report_url?: string | null;
    status: 'pending' | 'verifying' | 'approved' | 'rejected';
    admin_notes?: string | null;
    faculty?: { name: string };
    major?: { name: string };
}

interface EditLibraryFreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    dataItem: LibraryFree | null;
}

export default function EditLibraryFreeModal({
    isOpen,
    onClose,
    dataItem,
}: EditLibraryFreeModalProps) {
    // Definisi form disesuaikan dengan skema database
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        status: "pending" as LibraryFree['status'],
        turnitin_similarity_score: "" as string | number, // decimal(5,2)
        turnitin_report_url: "",
        admin_notes: "",
    });

    useEffect(() => {
        if (isOpen && dataItem) {
            setData({
                status: dataItem.status,
                turnitin_similarity_score: dataItem.turnitin_similarity_score ?? "",
                turnitin_report_url: dataItem.turnitin_report_url ?? "",
                admin_notes: dataItem.admin_notes ?? "",
            });
        }
    }, [isOpen, dataItem]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dataItem) return;

        // URL diarahkan ke route admin (pastikan route Laravel sudah sesuai)
        put(`/admin/bebas-pustaka/${dataItem.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        Verifikasi Pengajuan Bebas Pustaka
                    </DialogTitle>
                    <DialogDescription>
                        Tinjau dokumen dan perbarui status verifikasi mahasiswa.
                    </DialogDescription>
                </DialogHeader>

                {dataItem && (
                    <div className="bg-muted/40 border p-4 rounded-lg grid grid-cols-2 gap-4 text-sm mb-2">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Identitas Mahasiswa</p>
                            <p className="font-semibold text-base">{dataItem.full_name}</p>
                            <p className="font-mono text-muted-foreground">{dataItem.nim}</p>
                            <p className="text-xs">{dataItem.email}</p>
                            <p className="text-xs">{dataItem.phone_number}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Akademik</p>
                            <p className="font-medium">{dataItem.major?.name}</p>
                            <p className="text-xs text-muted-foreground">{dataItem.faculty?.name}</p>
                            <p className="text-xs font-medium bg-indigo-100 text-indigo-700 inline-block px-2 py-0.5 rounded mt-1">
                                {dataItem.degree_level} - Lulus {dataItem.graduation_year}
                            </p>
                            <p className="text-[10px] block mt-1 text-muted-foreground italic">Tujuan: {dataItem.purpose}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Bagian Dokumen */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold">Dokumen Mahasiswa</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <Button type="button" variant="outline" size="sm" className="h-20 flex-col gap-2 border-dashed hover:bg-red-50" asChild>
                                <a href={`/storage/${dataItem?.scientific_paper_path}`} target="_blank" rel="noopener noreferrer">
                                    <FileText className="h-5 w-5 text-red-500" />
                                    <span className="text-[9px] uppercase font-bold text-center leading-tight">Karya Ilmiah<br />(PDF)</span>
                                </a>
                            </Button>
                            <Button type="button" variant="outline" size="sm" className="h-20 flex-col gap-2 border-dashed hover:bg-blue-50" asChild>
                                <a href={`/storage/${dataItem?.ktm_scan_path}`} target="_blank" rel="noopener noreferrer">
                                    <User className="h-5 w-5 text-blue-500" />
                                    <span className="text-[9px] uppercase font-bold text-center leading-tight">Scan KTM</span>
                                </a>
                            </Button>
                            {dataItem?.upload_proof_path ? (
                                <Button type="button" variant="outline" size="sm" className="h-20 flex-col gap-2 border-dashed hover:bg-green-50" asChild>
                                    <a href={`/storage/${dataItem.upload_proof_path}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-5 w-5 text-green-500" />
                                        <span className="text-[9px] uppercase font-bold text-center leading-tight">Bukti Upload<br />Repository</span>
                                    </a>
                                </Button>
                            ) : (
                                <div className="h-20 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/20 opacity-50">
                                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Tanpa Bukti</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="font-bold">Status Verifikasi</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: any) => setData("status", val)}
                                disabled={processing}
                            >
                                <SelectTrigger id="status" className={
                                    data.status === 'approved' ? "border-green-500 bg-green-50" :
                                        data.status === 'rejected' ? "border-red-500 bg-red-50" : ""
                                }>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        <span className="text-yellow-600">Menunggu (Pending)</span>
                                    </SelectItem>
                                    <SelectItem value="verifying">
                                        <span>Dalam Verifikasi</span>
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        <span className="text-green-600 font-bold">Setujui (Approved)</span>
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        <span className="text-red-600 font-bold">Tolak (Rejected)</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-[10px] font-bold text-destructive">{errors.status}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="similarity" className="font-bold">Skor Turnitin (%)</Label>
                            <div className="relative">
                                <Input
                                    id="similarity"
                                    type="number"
                                    step="0.01"
                                    placeholder="Contoh: 15.50"
                                    value={data.turnitin_similarity_score}
                                    onChange={(e) => setData("turnitin_similarity_score", e.target.value)}
                                    disabled={processing}
                                />
                                <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
                            </div>
                            {errors.turnitin_similarity_score && <p className="text-[10px] font-bold text-destructive">{errors.turnitin_similarity_score}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="report_url" className="font-bold">URL Laporan Turnitin</Label>
                        <Input
                            id="report_url"
                            type="url"
                            placeholder="https://turnitin.com/newreport/..."
                            value={data.turnitin_report_url}
                            onChange={(e) => setData("turnitin_report_url", e.target.value)}
                            disabled={processing}
                        />
                        {errors.turnitin_report_url && <p className="text-[10px] font-bold text-destructive">{errors.turnitin_report_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin_notes" className={`font-bold ${data.status === 'rejected' ? "text-red-600" : ""}`}>
                            Catatan Admin {data.status === 'rejected' && "(Wajib mencantumkan alasan penolakan)"}
                        </Label>
                        <Textarea
                            id="admin_notes"
                            placeholder="Tulis alasan jika ditolak agar mahasiswa dapat memperbaiki dokumennya..."
                            className="min-h-[100px]"
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            disabled={processing}
                        />
                        {errors.admin_notes && <p className="text-[10px] font-bold text-destructive">{errors.admin_notes}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 min-w-[150px]">
                            {processing ? "Menyimpan..." : "Update & Beri Notifikasi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}