import { useForm } from "@inertiajs/react";
import { Send, User, Mail, Hash, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Message } from "@/pages/admin/cms/Kontak"; 

interface ReplyMessageModalProps {
    message: Message;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReplyMessageModal({ message, isOpen, onClose }: ReplyMessageModalProps) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        balasan_admin: message.balasan_admin || "",
        status: "selesai" as "pending" | "selesai", // Otomatis set selesai saat dibalas
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan patch untuk mengupdate record yang sudah ada
        patch(`/admin/messages/${message.id}`, {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        Detail & Balas Pesan
                    </DialogTitle>
                    <DialogDescription>
                        Berikan tanggapan resmi terhadap pesan dari {message.nama_lengkap}.
                    </DialogDescription>
                </DialogHeader>

                {/* INFO PENGIRIM (READ ONLY) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border text-sm">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Nama Lengkap
                        </Label>
                        <p className="font-medium">{message.nama_lengkap}</p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground flex items-center gap-1.5">
                            <Hash className="h-3 w-3" /> NIM / NIDN
                        </Label>
                        <p className="font-medium">{message.nim_nidn || "-"}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <Label className="text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3 w-3" /> Email
                        </Label>
                        <p className="font-medium">{message.email}</p>
                    </div>
                </div>

                {/* ISI PESAN USER */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="text-blue-600 font-bold">Isi Pesan ({message.subjek})</Label>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            Status: {message.status}
                        </Badge>
                    </div>
                    <div className="p-3 bg-white border rounded-md text-sm italic text-foreground/80">
                        "{message.pesan}"
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    {/* FORM BALASAN ADMIN */}
                    <div className="grid gap-2 pt-2 border-t">
                        <Label htmlFor="balasan_admin" className="font-bold">Balasan Admin</Label>
                        <Textarea
                            id="balasan_admin"
                            placeholder="Tuliskan balasan atau solusi di sini..."
                            value={data.balasan_admin}
                            onChange={(e) => setData("balasan_admin", e.target.value)}
                            rows={5}
                            className="bg-white focus-visible:ring-blue-500"
                        />
                        {errors.balasan_admin && (
                            <p className="text-xs text-destructive">{errors.balasan_admin}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            * Menyimpan balasan akan otomatis mengubah status pesan menjadi <strong>Selesai</strong>.
                        </p>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Tutup
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.balasan_admin}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {processing ? "Mengirim..." : "Kirim Balasan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}