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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Article {
    id: number;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
    reading_time: number;
    is_featured: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
}

export default function EditArticleModal({
    isOpen,
    onClose,
    article,
}: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        _method: "PUT",
        title: "",
        category: "Berita Utama",
        excerpt: "",
        content: "",
        thumbnail: null as File | null,
        reading_time: 5,
        is_featured: false,
    });

    /* ==============================
       Sync data ketika modal dibuka
    ============================== */
    useEffect(() => {
        if (isOpen && article) {
            setData({
                _method: "PUT",
                title: article.title ?? "",
                category: article.category ?? "Berita Utama",
                excerpt: article.excerpt ?? "",
                content: article.content ?? "",
                thumbnail: null,
                reading_time: article.reading_time ?? 5,
                is_featured: Boolean(article.is_featured),
            });
        }

        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, article]);

    /* ==============================
       Submit
    ============================== */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!article) return;

        post(`/admin/articles/${article.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Artikel</DialogTitle>
                    <DialogDescription>
                        Perbarui data artikel
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5 py-4">

                    {/* TITLE */}
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                        <Label>Kategori</Label>
                        <select
                            className="w-full border rounded-md p-2"
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                        >
                            <option>Berita Utama</option>
                            <option>Akademik</option>
                            <option>Koleksi</option>
                            <option>Event</option>
                            <option>Layanan</option>
                        </select>
                    </div>

                    {/* EXCERPT */}
                    <div className="space-y-2">
                        <Label>Excerpt</Label>
                        <Textarea
                            value={data.excerpt}
                            onChange={(e) => setData("excerpt", e.target.value)}
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-2">
                        <Label>Konten</Label>
                        <Textarea
                            rows={5}
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                        />
                    </div>

                    {/* THUMBNAIL */}
                    <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData("thumbnail", e.target.files?.[0] || null)
                            }
                        />
                    </div>

                    {/* READING TIME */}
                    <div className="space-y-2">
                        <Label>Estimasi Baca (menit)</Label>
                        <Input
                            type="number"
                            value={data.reading_time}
                            onChange={(e) =>
                                setData("reading_time", Number(e.target.value))
                            }
                        />
                    </div>

                    {/* FEATURED */}
                    <div className="flex items-center justify-between border p-3 rounded-md">
                        <Label>Featured</Label>
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
                            {processing ? "Menyimpan..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}