// @ts-nocheck
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import type { ScientificWork } from "@/components/admin/scientific-work/columns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Category {
    id: number;
    name: string;
}

interface EditScientificWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    scientificWork: ScientificWork | null;
    categories: Category[];
    onUpdate: (updatedWork: ScientificWork) => void;
}

export default function EditScientificWorkModal({
    isOpen,
    onClose,
    scientificWork,
    categories,
    onUpdate,
}: EditScientificWorkModalProps) {
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        researcher: "",
        publication_year: "",
        doi: "",
        abstract: "",
    });

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    // Sync data ketika modal dibuka atau scientificWork berubah
    useEffect(() => {
        if (scientificWork) {
            setFormData({
                category_id: scientificWork.category_id?.toString() || "",
                title: scientificWork.title || "",
                researcher: scientificWork.researcher || "",
                publication_year: scientificWork.publication_year?.toString() || "",
                doi: scientificWork.doi || "",
                abstract: scientificWork.abstract || "",
            });
        }
    }, [scientificWork]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            category_id: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scientificWork) return;

        setLoading(true);
        setMessage(null);

        router.put(`/admin/scientific-works/${scientificWork.id}`, formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Mengambil data terbaru dari props atau fallback ke local state
                const updatedData = (page.props.scientificWork as ScientificWork) || { ...scientificWork, ...formData };

                setMessage({ type: "success", text: "Data karya ilmiah berhasil diperbarui." });
                onUpdate(updatedData);

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

    if (!scientificWork) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Jurnal / Karya Ilmiah</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {message && (
                        <div
                            className={`p-2 rounded text-sm ${message.type === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Karya Ilmiah</Label>
                        <Input
                            id="edit_title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="researcher">Peneliti</Label>
                            <Input
                                id="edit_researcher"
                                name="researcher"
                                value={formData.researcher}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Kategori</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger id="edit_category">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="publication_year">Tahun Publikasi</Label>
                            <Input
                                id="edit_publication_year"
                                name="publication_year"
                                type="number"
                                value={formData.publication_year}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doi">DOI</Label>
                            <Input
                                id="edit_doi"
                                name="doi"
                                value={formData.doi}
                                onChange={handleChange}
                                placeholder="Contoh: 10.1234/abcd"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="abstract">Abstrak</Label>
                        <Textarea
                            id="edit_abstract"
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleChange}
                            className="min-h-[120px]"
                        />
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