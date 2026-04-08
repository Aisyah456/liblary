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
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { route } from "ziggy-js";

interface Message {
    id: number;
    nama_lengkap: string;
    email: string;
    subjek: string;
    pesan: string;
    balasan_admin?: string;
    status: 'pending' | 'selesai';
}

interface ReplyMessageModalProps {
    message: Message | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReplyMessageModal({
    message,
    isOpen,
    onClose
}: ReplyMessageModalProps) {
    if (!message) return null;

    // Inisialisasi Form Inertia
    const { data, setData, put, processing, errors, reset } = useForm({
        balasan_admin: message.balasan_admin || "",
        status: "selesai" as const, // Otomatis set jadi selesai saat dibalas
    });

    // Reset form saat pesan yang dipilih berubah
    React.useEffect(() => {
        if (message) {
            setData("balasan_admin", message.balasan_admin || "");
        }
    }, [message]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.messages.update', message.id), {
            onSuccess: () => {
                toast.success("Balasan berhasil dikirim!");
                onClose();
                reset();
            },
            onError: () => {
                toast.error("Gagal mengirim balasan. Silakan cek kembali.");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-6">
                        <DialogTitle>Balas Pesan</DialogTitle>
                        <Badge variant={message.status === 'selesai' ? 'default' : 'outline'}>
                            {message.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Kirim balasan email ke {message.nama_lengkap} terkait {message.subjek}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    {/* Informasi Pesan Masuk */}
                    <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-muted-foreground">Dari:</span>
                            <span>{message.email}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="font-semibold text-muted-foreground">Isi Pesan:</span>
                            <p className="italic text-foreground/80 leading-relaxed">
                                "{message.pesan}"
                            </p>
                        </div>
                    </div>

                    <hr className="border-muted" />

                    {/* Input Balasan */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="balasan" className="font-bold">Balasan Anda</Label>
                        <Textarea
                            id="balasan"
                            placeholder="Tulis instruksi atau jawaban di sini..."
                            className="min-h-[150px] focus-visible:ring-emerald-500"
                            value={data.balasan_admin}
                            onChange={(e) => setData("balasan_admin", e.target.value)}
                            disabled={processing}
                        />
                        {errors.balasan_admin && (
                            <p className="text-xs text-destructive">{errors.balasan_admin}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                            disabled={processing || !data.balasan_admin}
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Kirim Balasan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}