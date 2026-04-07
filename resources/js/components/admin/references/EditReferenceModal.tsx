import { useForm } from "@inertiajs/react";
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

// Interface sesuai dengan Database Schema
interface references {
    id: number;
    user_id: number;
    title: string;
    author: string;
    publisher?: string;
    isbn?: string;
    publication_year?: string | number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    user?: { name: string }; // Optional: jika ingin menampilkan nama pengusul
}

interface EditreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestion: references | null;
}

export default function EditreferencesModal({
    isOpen,
    onClose,
    suggestion,
}: EditreferencesModalProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        publication_year: "",
        reason: "",
        status: "pending",
        admin_notes: "",
    });

    // Sinkronisasi data saat modal dibuka atau suggestion dipilih
    useEffect(() => {
        if (isOpen && suggestion) {
            setData({
                title: suggestion.title || "",
                author: suggestion.author || "",
                publisher: suggestion.publisher || "",
                isbn: suggestion.isbn || "",
                publication_year: suggestion.publication_year?.toString() || "",
                reason: suggestion.reason || "",
                status: suggestion.status || "pending",
                admin_notes: suggestion.admin_notes || "",
            });
        }
    }, [isOpen, suggestion]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestion) return;

        // URL harus menyertakan ID: /book-suggestions/1
        put(`/references/${suggestion.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Kelola Usulan Buku</DialogTitle>
                    <DialogDescription>
                        Tinjau usulan buku dari mahasiswa dan perbarui statusnya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Bagian Informasi Buku (Read-only jika hanya admin yang boleh edit status) */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title">Judul Buku</Label>
                        <Input
                            id="edit-title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            disabled={processing}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-author">Penulis</Label>
                            <Input
                                id="edit-author"
                                value={data.author}
                                onChange={(e) => setData("author", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-year">Tahun Terbit</Label>
                            <Input
                                id="edit-year"
                                type="number"
                                value={data.publication_year}
                                onChange={(e) => setData("publication_year", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-isbn">ISBN</Label>
                            <Input
                                id="edit-isbn"
                                value={data.isbn}
                                onChange={(e) => setData("isbn", e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status Usulan</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: any) => setData("status", val)}
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Tertunda (Pending)</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-reason">Alasan Mahasiswa</Label>
                        <Textarea
                            id="edit-reason"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            disabled={processing}
                            rows={2}
                        />
                    </div>

                    {/* Catatan Admin - Penting jika status Rejected */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-notes" className={data.status === 'rejected' ? "text-destructive" : ""}>
                            Catatan Admin {data.status === 'rejected' && "(Wajib jika ditolak)"}
                        </Label>
                        <Textarea
                            id="edit-notes"
                            placeholder="Alasan disetujui atau ditolak..."
                            value={data.admin_notes}
                            onChange={(e) => setData("admin_notes", e.target.value)}
                            disabled={processing}
                            rows={3}
                        />
                        {errors.admin_notes && <p className="text-xs text-destructive">{errors.admin_notes}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}