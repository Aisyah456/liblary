import { useForm } from "@inertiajs/react";
import { FileText, User, ExternalLink, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
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
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Sesuaikan interface dengan schema database
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
    entry_year: number;
    graduation_year: number;
    scientific_paper_path: string;
    ktm_scan_path: string;
    upload_proof_path?: string | null;
    turnitin_similarity_score: number | string | null; // decimal(5,2)
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
    // Form Hook dari Inertia
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        status: "pending" as LibraryFree['status'],
        turnitin_similarity_score: "" as string | number,
        turnitin_report_url: "",
        admin_notes: "",
    });

    // Sinkronisasi data saat modal dibuka
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

        put(route('admin.bebas-pustaka.update', dataItem.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-162.5 max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                        Verifikasi Pengajuan Bebas Pustaka
                    </DialogTitle>
                    <DialogDescription>
                        Tinjau dokumen dan perbarui status verifikasi untuk NIM: <strong>{dataItem?.nim}</strong>
                    </DialogDescription>
                </DialogHeader>

                {dataItem && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Data Diri</p>
                            <p className="font-bold text-base text-slate-900">{dataItem.full_name}</p>
                            <p className="font-mono text-slate-600">{dataItem.nim}</p>
                            <p className="text-xs text-slate-600">{dataItem.email}</p>
                            <p className="text-xs text-slate-600">{dataItem.phone_number}</p>
                        </div>
                        <div className="space-y-1 md:text-right">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Program Studi</p>
                            <p className="font-medium text-slate-900">{dataItem.major?.name}</p>
                            <p className="text-xs text-slate-600">{dataItem.faculty?.name}</p>
                            <div className="flex flex-wrap md:justify-end gap-1 mt-1">
                                <BadgeDegree level={dataItem.degree_level} />
                                <span className="text-[10px] bg-white border px-2 py-0.5 rounded shadow-sm">
                                    Lulus {dataItem.graduation_year}
                                </span>
                            </div>
                            <p className="text-[10px] block mt-2 text-slate-500 italic">
                                Keperluan: {dataItem.purpose}
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Bagian Dokumen - Path disesuaikan dengan public storage Laravel */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700">Lampiran Dokumen (Klik untuk lihat)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <DocumentButton
                                href={`/storage/${dataItem?.scientific_paper_path}`}
                                icon={<FileText className="h-5 w-5 text-red-500" />}
                                label="Karya Ilmiah"
                                subLabel="PDF"
                            />
                            <DocumentButton
                                href={`/storage/${dataItem?.ktm_scan_path}`}
                                icon={<User className="h-5 w-5 text-blue-500" />}
                                label="Scan KTM"
                                subLabel="IMG/PDF"
                            />
                            {dataItem?.upload_proof_path ? (
                                <DocumentButton
                                    href={`/storage/${dataItem.upload_proof_path}`}
                                    icon={<ExternalLink className="h-5 w-5 text-emerald-500" />}
                                    label="Bukti Upload"
                                    subLabel="Repository"
                                />
                            ) : (
                                    <div className="h-20 border border-dashed rounded-md flex flex-col items-center justify-center bg-slate-50 opacity-60">
                                        <span className="text-[9px] uppercase font-bold text-slate-400 text-center">Tidak Ada<br />Bukti Upload</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="font-bold text-slate-700">Status Verifikasi</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: unknown) => setData("status", val as LibraryFree['status'])}
                                disabled={processing}
                            >
                                <SelectTrigger id="status" className={`h-11 ${data.status === 'approved' ? "border-emerald-500 bg-emerald-50 text-emerald-700" :
                                    data.status === 'rejected' ? "border-red-500 bg-red-50 text-red-700" : "bg-white"
                                    }`}>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending text-yellow-600">Menunggu (Pending)</SelectItem>
                                    <SelectItem value="verifying">Dalam Verifikasi</SelectItem>
                                    <SelectItem value="approved" className="text-emerald-600 font-semibold">Setujui (Approved)</SelectItem>
                                    <SelectItem value="rejected" className="text-red-600 font-semibold">Tolak (Rejected)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs font-bold text-red-500">{errors.status}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="similarity" className="font-bold text-slate-700">Turnitin Score (%)</Label>
                            <div className="relative">
                                <Input
                                    id="similarity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="h-11 pr-8"
                                    placeholder="0.00"
                                    value={data.turnitin_similarity_score}
                                    onChange={(e) => setData("turnitin_similarity_score", e.target.value)}
                                    disabled={processing}
                                />
                                <span className="absolute right-3 top-3 text-slate-400 text-sm">%</span>
                            </div>
                            {errors.turnitin_similarity_score && <p className="text-xs font-bold text-red-500">{errors.turnitin_similarity_score}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="report_url" className="font-bold text-slate-700">Link Laporan Turnitin</Label>
                        <Input
                            id="report_url"
                            type="url"
                            className="h-11"
                            placeholder="https://ev.turnitin.com/app/cata..."
                            value={data.turnitin_report_url}
                            onChange={(e) => setData("turnitin_report_url", e.target.value)}
                            disabled={processing}
                        />
                        {errors.turnitin_report_url && <p className="text-xs font-bold text-red-500">{errors.turnitin_report_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin_notes" className={`font-bold ${data.status === 'rejected' ? "text-red-600" : "text-slate-700"}`}>
                            Catatan Admin {data.status === 'rejected' && "(Wajib diisi jika ditolak)"}
                        </Label>
                        <Textarea
                            id="admin_notes"
                            placeholder={data.status === 'rejected' ? "Contoh: File PDF tidak bisa dibuka atau skor Turnitin terlalu tinggi..." : "Tambahkan catatan jika diperlukan..."}
                            className={`min-h-25 bg-white ${data.status === 'rejected' ? "border-red-200 focus-visible:ring-red-500" : ""}`}
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            disabled={processing}
                        />
                        {errors.admin_notes && <p className="text-xs font-bold text-red-500">{errors.admin_notes}</p>}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 px-8 h-11">
                            {processing ? "Memproses..." : "Update Status Verifikasi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Sub-komponen untuk merapikan kode
function BadgeDegree({ level }: { level: string }) {
    return (
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded shadow-sm">
            {level}
        </span>
    );
}

function DocumentButton({ href, icon, label, subLabel }: { href: string; icon: React.ReactNode; label: string; subLabel: string }) {
    return (
        <Button type="button" variant="outline" size="sm" className="h-20 flex-col gap-1 border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-400" asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
                {icon}
                <span className="text-[10px] font-bold text-slate-700 leading-tight mt-1">{label}</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-tighter">{subLabel}</span>
            </a>
        </Button>
    );
}