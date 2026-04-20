import { useForm } from "@inertiajs/react";
import {
    FileUp,
    User,
    Hash,
    Mail,
    BookText,
    X
} from "lucide-react";
import React from "react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

interface Faculty {
    id: string | number;
    name: string;
}

interface Major {
    id: string | number;
    faculty_id: string | number;
    name: string;
}

interface AddSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    faculties?: Faculty[];
    majors?: Major[];
}

export default function AddSubmissionModal({
    isOpen,
    onClose,
    faculties = [],
    majors = []
}: AddSubmissionModalProps) {

    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: "",
        identifier_id: "",
        email: "",
        faculty_id: "",
        major_id: "",
        title: "",
        document_type: "",
        academic_year: new Date().getFullYear().toString(),
        file: null as File | null,
    });

    const filteredMajors = majors.filter(
        (m) => String(m.faculty_id) === String(data.faculty_id)
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData("file", e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.turnitin.submissions.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-slate-50/50 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    {/* Header Custom */}
                    <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-10 flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileUp className="text-teal-600" />
                                Pengajuan Turnitin Baru
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 mt-1">
                                Pastikan data identitas dan dokumen sudah sesuai.
                            </DialogDescription>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-slate-100"
                        >
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* KARTU 1: IDENTITAS */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                    <User size={20} />
                                </div>
                                <h2 className="font-bold text-slate-800 tracking-wide uppercase text-sm">Informasi Personal</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        disabled={processing}
                                        className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 transition-all ${errors.full_name ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                        placeholder="Contoh: Ahmad Subardjo, S.Kom"
                                        value={data.full_name}
                                        onChange={e => setData('full_name', e.target.value)}
                                        required
                                    />
                                    {errors.full_name && <p className="text-xs text-rose-500 mt-1">{errors.full_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">NIM / NIDN</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Hash size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={processing}
                                            className={`w-full pl-10 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.identifier_id ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                            placeholder="202101001"
                                            value={data.identifier_id}
                                            onChange={e => setData('identifier_id', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.identifier_id && <p className="text-xs text-rose-500 mt-1">{errors.identifier_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Aktif</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            disabled={processing}
                                            className={`w-full pl-10 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.email ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                            placeholder="ahmad@gmail.com"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fakultas</label>
                                    <select
                                        disabled={processing}
                                        className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.faculty_id ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                        value={data.faculty_id}
                                        onChange={e => setData(prev => ({ ...prev, faculty_id: e.target.value, major_id: '' }))}
                                        required
                                    >
                                        <option value="">Pilih Fakultas</option>
                                        {faculties?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Program Studi</label>
                                    <select
                                        disabled={!data.faculty_id || processing}
                                        className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.major_id ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                        value={data.major_id}
                                        onChange={e => setData('major_id', e.target.value)}
                                        required
                                    >
                                        <option value="">{!data.faculty_id ? 'Pilih Fakultas Dahulu' : 'Pilih Program Studi'}</option>
                                        {filteredMajors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* KARTU 2: DETAIL DOKUMEN */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <BookText size={20} />
                                </div>
                                <h2 className="font-bold text-slate-800 tracking-wide uppercase text-sm">Detail Dokumen</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Judul Karya Ilmiah</label>
                                    <textarea
                                        disabled={processing}
                                        rows={3}
                                        className={`w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 p-4 transition-all ${errors.title ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                        placeholder="Contoh: Analisis Keamanan Jaringan Menggunakan Metode..."
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jenis Dokumen</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Skripsi', 'Tesis', 'Disertasi', 'Artikel'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() => setData('document_type', type)}
                                                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${data.document_type === type
                                                        ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                                                        } disabled:opacity-50`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tahun Akademik</label>
                                        <input
                                            type="text"
                                            disabled={processing}
                                            className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30"
                                            value={data.academic_year}
                                            onChange={e => setData('academic_year', e.target.value)}
                                            placeholder="2023/2024"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">File Dokumen</label>
                                    <div className="mt-2 group relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="file_modal"
                                            disabled={processing}
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="file_modal"
                                            className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${data.file
                                                ? 'border-teal-500 bg-teal-50/30'
                                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400'
                                                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex flex-col items-center text-center p-6">
                                                <div className={`p-3 rounded-full mb-3 ${data.file ? 'bg-teal-100 text-teal-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                    <FileUp size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {data.file ? data.file.name : 'Klik untuk pilih file'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">PDF, DOC, atau DOCX (Max. 10MB)</p>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.file && <p className="text-xs text-rose-500 mt-2">{errors.file}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-6 bg-white border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-xl px-6"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-teal-100 transition-all active:scale-95"
                        >
                            {processing ? "Memproses..." : "Kirim Pengajuan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}