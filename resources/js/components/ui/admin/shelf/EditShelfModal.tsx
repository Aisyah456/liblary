/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { Shelf } from '@/components/admin/shelf/columns';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
    shelf: Shelf | null;
    onUpdate: (updated: Shelf) => void;
}

export default function EditShelfModal({ isOpen, onClose, shelf, onUpdate }: EditShelfModalProps) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (shelf) {
            setFormData({
                code: shelf.code || '',
                name: shelf.name || '',
                location: shelf.location || '',
            });
        }
    }, [shelf]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shelf) return;

        setLoading(true);
        setMessage(null);

        router.put(`/admin/shelves/${shelf.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                const updated = { ...shelf, ...formData };
                setMessage({ type: 'success', text: 'Rak berhasil diperbarui.' });
                onUpdate(updated);
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 600);
            },
            onError: () => {
                setMessage({ type: 'error', text: 'Gagal menyimpan. Periksa input.' });
            },
            onFinish: () => setLoading(false),
        });
    };

    if (!shelf) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Rak</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {message && (
                        <div
                            className={`rounded p-2 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-shelf-code">Kode</Label>
                        <Input id="edit-shelf-code" name="code" value={formData.code} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-shelf-name">Nama</Label>
                        <Input id="edit-shelf-name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-shelf-location">Lokasi</Label>
                        <Input
                            id="edit-shelf-location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
