import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { EresourceAccess } from "@/components/admin/eresources/columns";
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

interface EditEresourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: EresourceAccess | null;
    onUpdate: (updatedResource: EresourceAccess) => void;
}

export default function EditEresourceModal({
    isOpen,
    onClose,
    resource,
    onUpdate,
}: EditEresourceModalProps) {
    const [formData, setFormData] = useState({
        resource_name: "",
        username_given: "",
        password_given: "",
        expiry_date: "",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resource) {
            setFormData({
                resource_name: resource.resource_name || "",
                username_given: resource.username_given || "",
                password_given: resource.password_given || "",
                expiry_date: resource.expiry_date || "",
            });
        }
    }, [resource]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resource) return;

        setLoading(true);
        setMessage(null);

        // Pastikan endpoint Laravel Anda sesuai: /admin/eresource-access/{id}
        router.put(`/admin/eresource-access/${resource.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const updatedData = { ...resource, ...formData };
                setMessage({ type: "success", text: "Akses E-Resource berhasil diperbarui." });
                onUpdate(updatedData as any);

                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 800);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({ type: "error", text: "Gagal memperbarui data. Periksa kembali inputan Anda." });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!resource) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Update Akses E-Resource</DialogTitle>
                    <DialogDescription>
                        Perbarui kredensial akun database untuk: <br />
                        <strong className="text-foreground">{resource.user?.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {message && (
                        <div className={`p-2 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="resource_name">Nama Database / Resource</Label>
                        <Input
                            id="resource_name"
                            name="resource_name"
                            value={formData.resource_name}
                            onChange={handleChange}
                            placeholder="Contoh: IEEE, Scopus, ScienceDirect"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username_given">Username Akun</Label>
                            <Input
                                id="username_given"
                                name="username_given"
                                value={formData.username_given}
                                onChange={handleChange}
                                placeholder="Username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_given">Password Akun</Label>
                            <Input
                                id="password_given"
                                name="password_given"
                                type="text" // Diubah ke text agar pustakawan mudah melihat apa yang diberikan
                                value={formData.password_given}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expiry_date">Tanggal Berakhir Akses</Label>
                        <Input
                            id="expiry_date"
                            name="expiry_date"
                            type="date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                            *Kosongkan jika akses tidak memiliki batas waktu.
                        </p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}