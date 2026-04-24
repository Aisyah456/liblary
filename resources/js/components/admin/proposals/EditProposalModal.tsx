import React from 'react';
import { useForm } from '@inertiajs/react';
import { BookProposalRow } from '@/pages/admin/PublicBook/BookProposalCmsPage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProposalForm({ proposal, onBack }: { proposal: BookProposalRow, onBack: () => void }) {
    const { data, setData, put, processing } = useForm({
        status: proposal.status,
        admin_note: proposal.admin_note || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.proposals.update', proposal.id), {
            onSuccess: () => onBack(),
        });
    };

    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 bg-slate-50/50">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
                    <ArrowLeft size={18} />
                </Button>
                <CardTitle>Review Usulan: {proposal.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Informasi Buku</p>
                        <p className="font-bold">{proposal.title}</p>
                        <p className="text-sm text-slate-600">Penulis: {proposal.author || '-'}</p>
                        <p className="text-sm text-slate-600">ISBN: {proposal.isbn || '-'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pengusul</p>
                        <p className="font-bold">{proposal.full_name}</p>
                        <p className="text-sm text-slate-600">{proposal.requester_type} - {proposal.email}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Update Status</label>
                        <div className="flex flex-wrap gap-2">
                            {['pending', 'approved', 'rejected', 'ordered', 'available'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setData('status', s as any)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${data.status === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">Catatan Pustakawan</label>
                        <Textarea
                            placeholder="Berikan alasan penolakan atau info estimasi kedatangan buku..."
                            value={data.admin_note}
                            onChange={e => setData('admin_note', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-teal-600 gap-2">
                            <Save size={18} /> Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function route(arg0: string, id: number): string {
    throw new Error('Function not implemented.');
}
