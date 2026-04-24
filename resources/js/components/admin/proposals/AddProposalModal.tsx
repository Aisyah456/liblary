import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function AddProposalForm({ onBack }: { onBack: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        identifier_id: '',
        email: '',
        requester_type: 'mahasiswa',
        title: '',
        author: '',
        isbn: '',
        reason: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.proposals.store'), {
            onSuccess: () => onBack(),
        });
    };

    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 bg-slate-50/50">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
                    <ArrowLeft size={18} />
                </Button>
                <CardTitle>Tambah Usulan Buku Manual</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-teal-600 text-sm uppercase tracking-wider">Identitas Pengusul</h3>
                        <Input placeholder="Nama Lengkap" value={data.full_name} onChange={e => setData('full_name', e.target.value)} />
                        <Input placeholder="NIM/NIDN/NIK" value={data.identifier_id} onChange={e => setData('identifier_id', e.target.value)} />
                        <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={data.requester_type}
                            onChange={e => setData('requester_type', e.target.value as any)}
                        >
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                            <option value="umum">Umum</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-teal-600 text-sm uppercase tracking-wider">Detail Buku</h3>
                        <Input placeholder="Judul Buku" value={data.title} onChange={e => setData('title', e.target.value)} />
                        <Input placeholder="Penulis" value={data.author} onChange={e => setData('author', e.target.value)} />
                        <Textarea placeholder="Alasan Usulan" value={data.reason} onChange={e => setData('reason', e.target.value)} />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onBack}>Batal</Button>
                        <Button type="submit" disabled={processing} className="bg-teal-600">
                            {processing ? <Loader2 className="animate-spin" /> : "Simpan Usulan"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function route(arg0: string): string {
    throw new Error('Function not implemented.');
}
