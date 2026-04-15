import { Head, useForm } from '@inertiajs/react';
import { useMemo, FormEvent, ChangeEvent, ReactNode, ElementType } from 'react';
import {
    Send,
    UploadCloud,
    User,
    GraduationCap,
    Mail,
    Phone,
    Hash,
    FileCheck,
    AlertCircle
} from 'lucide-react';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { route } from 'ziggy-js';

// Interface Definitions
interface Faculty { id: number; name: string; }
interface Major { id: number; name: string; faculty_id: number; degree_level: string; }
interface Props { faculties: Faculty[]; majors: Major[]; }

interface FormData {
    full_name: string;
    nim: string;
    phone_number: string;
    email: string;
    faculty_id: string;
    major_id: string;
    degree_level: string;
    purpose: string;
    entry_year: string;
    graduation_year: string;
    scientific_paper_path: File | null;
    ktm_scan_path: File | null;
    upload_proof_path: File | null;
}

export default function LibraryFreeForm({ faculties, majors }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        full_name: '',
        nim: '',
        phone_number: '',
        email: '',
        faculty_id: '',
        major_id: '',
        degree_level: '',
        purpose: 'Yudisium',
        entry_year: (new Date().getFullYear() - 4).toString(),
        graduation_year: new Date().getFullYear().toString(),
        scientific_paper_path: null,
        ktm_scan_path: null,
        upload_proof_path: null,
    });

    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        return majors.filter(major => major.faculty_id === parseInt(data.faculty_id));
    }, [data.faculty_id, majors]);

    const handleFacultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData((prev) => ({
            ...prev,
            faculty_id: e.target.value,
            major_id: '',
            degree_level: ''
        }));
    };

    const handleMajorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const selectedMajor = majors.find(m => m.id === parseInt(id));
        setData((prev) => ({
            ...prev,
            major_id: id,
            degree_level: selectedMajor ? selectedMajor.degree_level : ''
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // forceFormData: true wajib digunakan saat mengirim file via Inertia
        post(route('library-free.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                alert('Pengajuan berhasil dikirim!');
            },
        });
    };

    // --- Reusable Styled Components ---

    interface InputWrapperProps {
        label: string;
        icon?: ElementType;
        error?: string;
        children: ReactNode;
    }

    const InputWrapper = ({ label, icon: Icon, error, children }: InputWrapperProps) => (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 ml-1">
                {Icon && <Icon size={14} className="text-indigo-500" />}
                {label}
            </label>
            {children}
            {error && <p className="text-[11px] text-red-500 ml-1 font-medium">{error}</p>}
        </div>
    );

    const inputClasses = "w-full px-4 py-3 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200 placeholder:text-slate-400 text-sm outline-none border";

    return (
        <>
            <Head title="Bebas Pustaka - UMHT" />
            <div className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100 selection:text-indigo-700">
                <Navbar auth={undefined} />

                <main className="pt-36 pb-24">
                    <div className="mx-auto max-w-5xl px-4">

                        {/* Hero Header */}
                        <div className="relative text-center mb-16">
                            <div className="absolute inset-0 -top-20 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(99,102,241,0.08)_0%,rgba(255,255,255,0)_100%)] h-80 pointer-events-none" />
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Digital Library Services
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                                Bebas <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">Pustaka</span>
                            </h1>
                            <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
                                Portal pengajuan surat keterangan bebas pinjam perpustakaan secara mandiri untuk mahasiswa tingkat akhir.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Side: Forms */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Section 1: Data Diri */}
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">Profil Mahasiswa</h2>
                                            <p className="text-xs text-slate-400">Pastikan data sesuai dengan KTM/KTP</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputWrapper label="Nama Lengkap" icon={User} error={errors.full_name}>
                                            <input type="text" className={inputClasses} placeholder="Masukkan nama sesuai ijazah" value={data.full_name} onChange={e => setData('full_name', e.target.value)} required />
                                        </InputWrapper>

                                        <InputWrapper label="NIM" icon={Hash} error={errors.nim}>
                                            <input type="text" className={inputClasses} placeholder="Nomor Induk Mahasiswa" value={data.nim} onChange={e => setData('nim', e.target.value)} required />
                                        </InputWrapper>

                                        <InputWrapper label="Email Institusi" icon={Mail} error={errors.email}>
                                            <input type="email" className={inputClasses} placeholder="mahasiswa@uhmth.ac.id" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                        </InputWrapper>

                                        <InputWrapper label="No. WhatsApp" icon={Phone} error={errors.phone_number}>
                                            <input type="tel" className={inputClasses} placeholder="0812xxxx" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} required />
                                        </InputWrapper>
                                    </div>
                                </div>

                                {/* Section 2: Akademik */}
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">Informasi Akademik</h2>
                                            <p className="text-xs text-slate-400">Pilih program studi yang terdaftar</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputWrapper label="Fakultas" error={errors.faculty_id}>
                                                <select className={inputClasses} value={data.faculty_id} onChange={handleFacultyChange} required>
                                                    <option value="">Pilih Fakultas</option>
                                                    {faculties?.map(f => <option key={f.id} value={f.id.toString()}>{f.name}</option>)}
                                                </select>
                                            </InputWrapper>

                                            <InputWrapper label="Program Studi" error={errors.major_id}>
                                                <select className={inputClasses} value={data.major_id} disabled={!data.faculty_id} onChange={handleMajorChange} required>
                                                    <option value="">Pilih Program Studi</option>
                                                    {filteredMajors.map(m => <option key={m.id} value={m.id.toString()}>{m.name}</option>)}
                                                </select>
                                            </InputWrapper>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <InputWrapper label="Jenjang">
                                                <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-sm text-center border border-slate-200 min-h-11.5 flex items-center justify-center">
                                                    {data.degree_level || '-'}
                                                </div>
                                            </InputWrapper>
                                            <InputWrapper label="Keperluan">
                                                <select className={inputClasses} value={data.purpose} onChange={e => setData('purpose', e.target.value)}>
                                                    <option value="Yudisium">Yudisium</option>
                                                    <option value="Wisuda">Wisuda</option>
                                                    <option value="Pindah">Pindah</option>
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Thn Masuk">
                                                <input type="number" className={`${inputClasses} text-center`} value={data.entry_year} onChange={e => setData('entry_year', e.target.value)} />
                                            </InputWrapper>
                                            <InputWrapper label="Thn Lulus">
                                                <input type="number" className={`${inputClasses} text-center`} value={data.graduation_year} onChange={e => setData('graduation_year', e.target.value)} />
                                            </InputWrapper>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Uploads & Submit */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <FileCheck className="text-indigo-300" size={20} />
                                            Dokumen Wajib
                                        </h3>

                                        <div className="space-y-4">
                                            <label className={`block border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer text-center group/upload
                                                ${data.scientific_paper_path ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-indigo-700 hover:border-indigo-400 bg-indigo-950/30'}`}>
                                                <UploadCloud className={`mx-auto mb-2 ${data.scientific_paper_path ? 'text-emerald-400' : 'text-indigo-400'}`} size={28} />
                                                <p className="text-[11px] font-bold uppercase tracking-wider mb-1">Karya Ilmiah (PDF)</p>
                                                <p className="text-[10px] text-indigo-300 truncate px-2">
                                                    {data.scientific_paper_path ? data.scientific_paper_path.name : 'Klik untuk cari file'}
                                                </p>
                                                <input type="file" className="hidden" accept=".pdf" onChange={e => setData('scientific_paper_path', e.target.files ? e.target.files[0] : null)} />
                                            </label>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Scan KTM</p>
                                                    <input type="file" accept="image/*" className="text-[10px] text-slate-800 w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
                                                        onChange={e => setData('ktm_scan_path', e.target.files ? e.target.files[0] : null)} />
                                                </div>
                                                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Bukti Repository</p>
                                                    <input type="file" accept="image/*" className="text-[10px] text-slate-800 w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
                                                        onChange={e => setData('upload_proof_path', e.target.files ? e.target.files[0] : null)} />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full mt-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Processing...' : (
                                                <>Kirim Data <Send size={16} /></>
                                            )}
                                        </button>

                                        <p className="text-[10px] text-indigo-300 text-center mt-4 italic">
                                            *Pastikan semua file yang diunggah terbaca dengan jelas.
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                                </div>

                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                    <div className="flex gap-3">
                                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                        <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                            Proses verifikasi membutuhkan waktu 1-3 hari kerja. Notifikasi akan dikirimkan melalui email atau WhatsApp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}