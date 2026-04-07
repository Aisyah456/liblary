import { useForm } from "@inertiajs/react";
import { FileText, ExternalLink, User, GraduationCap } from "lucide-react";
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
    upload_proof_path?: string;
    turnitin_similarity_score?: number | string;
    turnitin_report_url?: string;
    status: 'pending' | 'verifying' | 'approved' | 'rejected';
    admin_notes?: string;
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
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        status: "pending",
        turnitin_similarity_score: "" as string | number,
        turnitin_report_url: "",
        admin_notes: "",
    });

    useEffect(() => {
        if (isOpen && dataItem) {
            setData({
                status: dataItem.status || "pending",
                turnitin_similarity_score: dataItem.turnitin_similarity_score ?? "",
                turnitin_report_url: dataItem.turnitin_report_url || "",
                admin_notes: dataItem.admin_notes || "",
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

        put(`/library-frees/${dataItem.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Verifikasi Bebas Pustaka</DialogTitle>
                    <DialogDescription>
                        Tinjau dokumen mahasiswa dan perbarui status verifikasi perpustakaan.
                    </DialogDescription>
                </DialogHeader>

                {dataItem && (
                    <div className="bg-muted/50 p-4 rounded-lg grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                            <p className="text-muted-foreground text-xs uppercase font-semibold">Mahasiswa</p>
                            <p className="font-medium">{dataItem.full_name}</p>
                            <p className="font-mono text-xs">{dataItem.nim}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs uppercase font-semibold">Prodi / Jenjang</p>
                            <p>{dataItem.major?.name}</p>
                            <p className="text-xs">{dataItem.degree_level} - {dataItem.graduation_year}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Bagian File Dokumen (Read Only / Download) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dokumen Mahasiswa</Label>
                            <div className="flex flex-col gap-2">
                                <Button type="button" variant="outline" size="sm" className="justify-start" asChild>
                                    <a href={`/storage/${dataItem?.scientific_paper_path}`} target="_blank" rel="noreferrer">
                                        <FileText className="mr-2 h-4 w-4" /> Karya Ilmiah
                                    </a>
                                </Button>
                                <Button type="button" variant="outline" size="sm" className="justify-start" asChild>
                                    <a href={`/storage/${dataItem?.ktm_scan_path}`} target="_blank" rel="noreferrer">
                                        <User className="mr-2 h-4 w-4" /> Scan KTM
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status Verifikasi</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: any) => setData("status", val)}
                                disabled={processing}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Menunggu (Pending)</SelectItem>
                                    <SelectItem value="verifying">Dalam Verifikasi</SelectItem>
                                    <SelectItem value="approved">Disetujui / Bebas</SelectItem>
                                    <SelectItem value="rejected">Ditolak / Perbaiki</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                        </div>
                    </div>

                    <hr />

                    {/* Modul Turnitin (Admin Only Input) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="similarity">Turnitin Score (%)</Label>
                            <Input
                                id="similarity"
                                type="number"
                                step="0.01"
                                placeholder="Contoh: 15.50"
                                value={data.turnitin_similarity_score}
                                onChange={(e) => setData("turnitin_similarity_score", e.target.value)}
                                disabled={processing}
                            />
                            {errors.turnitin_similarity_score && <p className="text-xs text-destructive">{errors.turnitin_similarity_score}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="report_url">URL Laporan Turnitin</Label>
                            <Input
                                id="report_url"
                                placeholder="https://turnitin.com/..."
                                value={data.turnitin_report_url}
                                onChange={(e) => setData("turnitin_report_url", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Catatan Admin */}
                    <div className="space-y-2">
                        <Label htmlFor="admin_notes" className={data.status === 'rejected' ? "text-destructive" : ""}>
                            Catatan Admin {data.status === 'rejected' && "(Wajib mencantumkan alasan penolakan)"}
                        </Label>
                        <Textarea
                            id="admin_notes"
                            placeholder="Contoh: File PDF tidak bisa dibuka atau revisi skor turnitin melebihi batas..."
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            disabled={processing}
                            rows={3}
                        />
                        {errors.admin_notes && <p className="text-xs text-destructive">{errors.admin_notes}</p>}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={handleClose} disabled={processing}>
                            Tutup
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            {processing ? "Memproses..." : "Update Status Verifikasi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}