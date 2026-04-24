import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    FileUp, User, Hash, Mail, BookText, X,
    CheckCircle2, Loader2, Calendar, ChevronDown
} from "lucide-react";
import { route } from "ziggy-js"; // Pastikan ziggy terkonfigurasi di aplikasi Anda
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Faculty {
    id: number | string;
    name: string;
}

interface Major {
    id: number | string;
    faculty_id: number | string;
    name: string;
}

interface AddSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    faculties: Faculty[];
    majors: Major[];
}

export default function AddSubmissionModal({
    isOpen,
    onClose,
    faculties = [],
    majors = []
}: AddSubmissionModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<string>("");

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        full_name: "",
        identifier_id: "",
        email: "",
        major_id: "",
        title: "",
        document_type: "",
        academic_year: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        file: null as File | null,
    });

    // Reset form saat modal dibuka/ditutup
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
            setSelectedFaculty("");
        }
    }, [isOpen]);

    const filteredMajors = useMemo(() => {
        if (!selectedFaculty) return [];
        return majors.filter((m) => String(m.faculty_id) === String(selectedFaculty));
    }, [selectedFaculty, majors]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setData("file", file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.turnitin.submissions.store'), {
            onSuccess: () => {
                onClose();
            },
            // forceFormData otomatis true jika mengirim File di Inertia
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-slate-50 max-h-[95vh] flex flex-col shadow-2xl focus:outline-none">

                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white shrink-0">
                    <div className="absolute top-4 right-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                        >
                            <X size={24} />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-inner">
                            <FileUp size={32} className="text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                Pengajuan Turnitin
                            </DialogTitle>
                            <DialogDescription className="text-teal-50/80 font-medium">
                                Lengkapi detail dokumen untuk memulai proses verifikasi orisinalitas.
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 custom-scrollbar">
                    <div className="p-8 space-y-8">

                        {/* Section Identitas */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-8 w-1 bg-teal-500 rounded-full"></span>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Informasi Mahasiswa</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                {/* Input Nama */}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2 px-1">
                                        <User size={12} /> Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3.5 rounded-2xl border ${errors.full_name ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500'} bg-white transition-all outline-none`}
                                        placeholder="Nama lengkap pengaju"
                                        value={data.full_name}
                                        onChange={e => setData('full_name', e.target.value)}
                                    />
                                    {errors.full_name && <p className="text-[11px] font-bold text-rose-500 ml-2">{errors.full_name}</p>}
                                </div>

                                {/* Input NIM */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2 px-1">
                                        <Hash size={12} /> NIM / ID
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3.5 rounded-2xl border ${errors.identifier_id ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500'} bg-white transition-all outline-none`}
                                        placeholder="NIM/NIDN"
                                        value={data.identifier_id}
                                        onChange={e => setData('identifier_id', e.target.value)}
                                    />
                                    {errors.identifier_id && <p className="text-[11px] font-bold text-rose-500 ml-2">{errors.identifier_id}</p>}
                                </div>

                                {/* Dropdown Fakultas */}
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase px-1">Fakultas</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500"
                                            value={selectedFaculty}
                                            onChange={e => {
                                                setSelectedFaculty(e.target.value);
                                                setData('major_id', '');
                                            }}
                                        >
                                            <option value="">Pilih Fakultas</option>
                                            {faculties?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Dropdown Prodi */}
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase px-1">Program Studi</label>
                                    <div className="relative">
                                        <select
                                            disabled={!selectedFaculty}
                                            className={`w-full px-4 py-3.5 rounded-2xl border ${errors.major_id ? 'border-rose-500' : 'border-slate-200'} bg-white shadow-sm outline-none appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500`}
                                            value={data.major_id}
                                            onChange={e => setData('major_id', e.target.value)}
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            {filteredMajors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                    {errors.major_id && <p className="text-[11px] font-bold text-rose-500 ml-2">{errors.major_id}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Section Dokumen */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-8 w-1 bg-emerald-500 rounded-full"></span>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Detail Karya Ilmiah</h2>
                            </div>

                            <div className="space-y-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2 px-1">
                                        <BookText size={12} /> Judul Penelitian
                                    </label>
                                    <textarea
                                        rows={3}
                                        className={`w-full rounded-2xl border ${errors.title ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-200'} focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 p-4 outline-none resize-none transition-all`}
                                        placeholder="Tuliskan judul lengkap..."
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-[11px] font-bold text-rose-500 ml-2">{errors.title}</p>}
                                </div>

                                {/* Kategori Dokumen */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase px-1">Kategori Dokumen</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Skripsi', 'Tesis', 'Disertasi', 'Artikel', 'KTI'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setData('document_type', type)}
                                                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${data.document_type === type
                                                    ? 'bg-teal-600 text-white shadow-md scale-105'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.document_type && <p className="text-[11px] font-bold text-rose-500 ml-2">{errors.document_type}</p>}
                                </div>

                                {/* Dropzone */}
                                <div className="pt-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file_modal"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file_modal"
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) setData("file", file);
                                        }}
                                        className={`relative flex flex-col items-center justify-center w-full py-10 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all ${data.file
                                            ? 'border-emerald-500 bg-emerald-50/50'
                                            : isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50/30 hover:border-teal-400'
                                            }`}
                                    >
                                        {data.file ? (
                                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                <div className="p-4 bg-emerald-500 rounded-full text-white mb-4 shadow-lg shadow-emerald-200">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <p className="text-sm font-black text-emerald-700">{data.file.name}</p>
                                                <p className="text-[10px] text-emerald-600/60 uppercase mt-1 font-bold">File Terpilih</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center px-4">
                                                <div className="p-4 bg-slate-100 rounded-full mb-4 text-slate-400">
                                                    <FileUp size={32} />
                                                </div>
                                                    <p className="text-base font-black text-slate-600">Klik atau seret file ke sini</p>
                                                    <p className="text-xs font-bold text-slate-400 mt-1">PDF ATAU DOCX (MAX. 10MB)</p>
                                                </div>
                                        )}
                                    </label>
                                    {errors.file && <p className="text-xs text-rose-500 mt-2 text-center font-bold">{errors.file}</p>}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer - Sticky */}
                    <div className="p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-end sticky bottom-0 z-20 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-2xl px-6 h-12 font-bold text-slate-500"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.file}
                            className={`rounded-2xl px-8 h-12 font-black transition-all shadow-lg ${processing ? 'opacity-70' : 'bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-teal-200'
                                }`}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" size={18} />
                                    Memproses...
                                </>
                            ) : "Kirim Dokumen"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}