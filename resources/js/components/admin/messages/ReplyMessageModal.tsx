"use client"

import * as React from "react"
import { useForm } from "@inertiajs/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, MessageSquare, User, Hash, Mail } from "lucide-react"
import { toast } from "sonner"
import { route } from "ziggy-js";
import type { Message } from "@/pages/admin/cms/Kontak";

interface ReplyMessageModalProps {
    message: Message | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReplyMessageModal({ message, isOpen, onClose }: ReplyMessageModalProps) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        balasan_admin: "",
        status: "selesai" as const,
    });

    // Reset data form setiap kali 'message' berganti
    React.useEffect(() => {
        if (message) {
            setData("balasan_admin", message.balasan_admin || "");
        }
    }, [message]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) return;

        patch(route('admin.messages.update', message.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Balasan berhasil disimpan!");
                handleClose();
            },
            onError: () => toast.error("Gagal menyimpan balasan."),
        });
    };

    if (!message) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        Detail & Balas Pesan
                    </DialogTitle>
                    <DialogDescription>
                        Kirim tanggapan resmi kepada {message.nama_lengkap}.
                    </DialogDescription>
                </DialogHeader>

                {/* INFO PENGIRIM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border text-sm">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Pengirim
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

                {/* ISI PESAN */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-indigo-600 font-bold">Pesan: {message.subjek}</Label>
                        <Badge variant={message.status === 'selesai' ? 'default' : 'outline'} className="text-[10px] uppercase">
                            {message.status}
                        </Badge>
                    </div>
                    <div className="p-3 bg-white border rounded-md text-sm italic text-foreground/80 leading-relaxed">
                        "{message.pesan}"
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 pt-4 border-t">
                    <div className="grid gap-2">
                        <Label htmlFor="balasan_admin" className="font-bold">Balasan Admin</Label>
                        <Textarea
                            id="balasan_admin"
                            placeholder="Tuliskan jawaban atau solusi..."
                            className="min-h-[150px] focus-visible:ring-indigo-500"
                            value={data.balasan_admin}
                            onChange={(e) => setData("balasan_admin", e.target.value)}
                            disabled={processing}
                        />
                        {errors.balasan_admin && (
                            <p className="text-xs text-destructive">{errors.balasan_admin}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            * Status akan otomatis berubah menjadi <strong>Selesai</strong> setelah disimpan.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                            disabled={processing || !data.balasan_admin}
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Kirim Balasan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}