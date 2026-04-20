import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddEresourceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddEresourceModal({ isOpen, onClose }: AddEresourceModalProps) {
    const [formData, setFormData] = useState({
        user_id: '',
        resource_name: '',
        username_given: '',
        password_given: '',
        expiry_date: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post('/admin/eresource-access', formData, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setFormData({
                    user_id: '',
                    resource_name: '',
                    username_given: '',
                    password_given: '',
                    expiry_date: '',
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Akses E-Resource</DialogTitle>
                    <DialogDescription>Masukkan user dan detail akun vendor (IEEE, Scopus, dll).</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">ID User (users.id)</Label>
                        <Input
                            id="user_id"
                            type="number"
                            required
                            value={formData.user_id}
                            onChange={(e) => setFormData((p) => ({ ...p, user_id: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="resource_name">Nama resource</Label>
                        <Input
                            id="resource_name"
                            required
                            value={formData.resource_name}
                            onChange={(e) => setFormData((p) => ({ ...p, resource_name: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username_given">Username (opsional)</Label>
                        <Input
                            id="username_given"
                            value={formData.username_given}
                            onChange={(e) => setFormData((p) => ({ ...p, username_given: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_given">Password (opsional)</Label>
                        <Input
                            id="password_given"
                            type="password"
                            value={formData.password_given}
                            onChange={(e) => setFormData((p) => ({ ...p, password_given: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="expiry_date">Tanggal kedaluwarsa (opsional)</Label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={formData.expiry_date}
                            onChange={(e) => setFormData((p) => ({ ...p, expiry_date: e.target.value }))}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
