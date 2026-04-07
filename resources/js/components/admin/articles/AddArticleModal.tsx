import { useForm } from "@inertiajs/react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddArticleModal({ isOpen, onClose }: AddArticleModalProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        title: "",
        category: "Berita Utama",
        excerpt: "",
        content: "",
        thumbnail: null as File | null,
        reading_time: 5,
        is_featured: false,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/articles", {
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Artikel</DialogTitle>
                    <DialogDescription>
                        Tambahkan berita atau artikel baru ke sistem.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {/* TITLE */}
                    <div className="grid gap-2">
                        <Label>Judul</Label>
                        <Input
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title}</p>
                        )}
                    </div>

                    {/* CATEGORY */}
                    <div className="grid gap-2">
                        <Label>Kategori</Label>
                        <Select
                            value={data.category}
                            onValueChange={(val: any) => setData("category", val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Berita Utama">Berita Utama</SelectItem>
                                <SelectItem value="Akademik">Akademik</SelectItem>
                                <SelectItem value="Koleksi">Koleksi</SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Layanan">Layanan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* EXCERPT */}
                    <div className="grid gap-2">
                        <Label>Ringkasan</Label>
                        <Textarea
                            value={data.excerpt}
                            onChange={(e) => setData("excerpt", e.target.value)}
                            rows={2}
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="grid gap-2">
                        <Label>Konten</Label>
                        <Textarea
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            rows={6}
                        />
                    </div>

                    {/* THUMBNAIL */}
                    <div className="grid gap-2">
                        <Label>Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData("thumbnail", e.target.files?.[0] || null)
                            }
                        />
                        {errors.thumbnail && (
                            <p className="text-xs text-destructive">
                                {errors.thumbnail}
                            </p>
                        )}
                    </div>

                    {/* READING TIME */}
                    <div className="grid gap-2">
                        <Label>Waktu Baca (menit)</Label>
                        <Input
                            type="number"
                            value={data.reading_time}
                            onChange={(e) =>
                                setData("reading_time", parseInt(e.target.value) || 0)
                            }
                        />
                    </div>

                    {/* FEATURED */}
                    <div className="flex items-center justify-between border p-3 rounded-md">
                        <Label>Artikel Unggulan</Label>
                        <Switch
                            checked={data.is_featured}
                            onCheckedChange={(val) =>
                                setData("is_featured", val)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}