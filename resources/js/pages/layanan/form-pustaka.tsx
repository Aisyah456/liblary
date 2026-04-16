import { Head, useForm } from '@inertiajs/react';
import { useMemo, FormEvent } from 'react';
import {
    Send,
    UploadCloud,
    User,
    GraduationCap,
    FileText,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    Hash,
    ShieldCheck
} from 'lucide-react';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { route } from 'ziggy-js';

// --- Interfaces ---
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
    entry_year: number;
    graduation_year: number;
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
        entry_year: new Date().getFullYear() - 4,
        graduation_year: new Date().getFullYear(),
        scientific_paper_path: null,
        ktm_scan_path: null,
        upload_proof_path: null,
    });

    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        return majors.filter(major => major.faculty_id === parseInt(data.faculty_id));
    }, [data.faculty_id, majors]);

    const handleMajorChange = (id: string) => {
        const selectedMajor = majors.find(m => m.id === parseInt(id));
        setData(prev => ({
            ...prev,
            major_id: id,
            degree_level: selectedMajor ? selectedMajor.degree_level : ''
        }));
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Gunakan nama route yang sesuai dengan Resource Controller
        post(route('bebas-pustaka.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                alert('Pengajuan berhasil dikirim!');
            },
            onError: (errors) => {
                console.log(errors); // Cek error validasi di console jika gagal
            }
        });
    };

    // --- Sub-Components ---
    const InputLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">
            {Icon && <Icon size={14} className="text-indigo-500" />}
            {children}
        </label>
    );

    const inputClasses = (error?: string) => `
        w-full px-4 py-3 rounded-xl border bg-white text-slate-700 text-sm
        transition-all duration-200 outline-none
        ${error
            ? 'border-red-300 ring-4 ring-red-500/5 focus:border-red-500'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
        }
        placeholder:text-slate-300
    `;

    return (
        <>
            <Head title="Pengajuan Bebas Pustaka - UMHT" />
            <div className="min-h-screen bg-[#F8FAFC]"> {/* Subtle blue-gray background */}
                <Navbar auth={undefined} />

                <main className="pt-32 pb-24">
                    <div className="mx-auto max-w-4xl px-4">

                        {/* Header Section */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                                <ShieldCheck size={14} />
                                Official Student Services
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                                Bebas <span className="text-indigo-600">Pustaka</span>
                            </h1>
                            <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
                                Form digital untuk pengajuan surat keterangan bebas pinjam perpustakaan.
                                Pastikan seluruh data akademik Anda sudah sesuai.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* SECTION 1: IDENTITAS */}
                            <section className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white shadow-sm border border-slate-100 text-indigo-600 rounded-2xl">
                                            <User size={22} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-800 text-lg">Identitas Mahasiswa</h2>
                                            <p className="text-xs text-slate-400">Informasi personal sesuai kartu mahasiswa</p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-tighter">Step 01</span>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <InputLabel icon={User}>Nama Lengkap</InputLabel>
                                        <input
                                            type="text"
                                            className={inputClasses(errors.full_name)}
                                            placeholder="John Doe"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                            required
                                        />
                                        {errors.full_name && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.full_name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel icon={Hash}>NIM</InputLabel>
                                        <input
                                            type="text"
                                            className={inputClasses(errors.nim)}
                                            placeholder="12345678"
                                            value={data.nim}
                                            onChange={e => setData('nim', e.target.value)}
                                            required
                                        />
                                        {errors.nim && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.nim}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel icon={Mail}>Email Institusi</InputLabel>
                                        <input
                                            type="email"
                                            className={inputClasses(errors.email)}
                                            placeholder="mahasiswa@umht.ac.id"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel icon={Phone}>No. WhatsApp</InputLabel>
                                        <input
                                            type="tel"
                                            className={inputClasses()}
                                            placeholder="0812..."
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: AKADEMIK */}
                            <section className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white shadow-sm border border-slate-100 text-emerald-600 rounded-2xl">
                                            <GraduationCap size={22} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-800 text-lg">Status Akademik</h2>
                                            <p className="text-xs text-slate-400">Data program studi dan fakultas</p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-tighter">Step 02</span>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <InputLabel>Fakultas</InputLabel>
                                        <select
                                            className={inputClasses()}
                                            value={data.faculty_id}
                                            onChange={e => setData(d => ({ ...d, faculty_id: e.target.value, major_id: '', degree_level: '' }))}
                                            required
                                        >
                                            <option value="">Pilih Fakultas</option>
                                            {faculties?.map(f => <option key={f.id} value={f.id.toString()}>{f.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel>Program Studi</InputLabel>
                                        <select
                                            className={inputClasses()}
                                            value={data.major_id}
                                            disabled={!data.faculty_id}
                                            onChange={e => handleMajorChange(e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            {filteredMajors.map(m => <option key={m.id} value={m.id.toString()}>{m.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <InputLabel>Jenjang</InputLabel>
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-bold text-center text-sm"
                                                value={data.degree_level || '-'}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <InputLabel>Keperluan</InputLabel>
                                            <select
                                                className={inputClasses()}
                                                value={data.purpose}
                                                onChange={e => setData('purpose', e.target.value)}
                                            >
                                                <option value="Yudisium">Yudisium</option>
                                                <option value="Wisuda">Wisuda</option>
                                                <option value="Pindah Kampus">Pindah</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel icon={Calendar}>Tahun Masuk — Lulus</InputLabel>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className={`${inputClasses()} text-center`}
                                                value={data.entry_year}
                                                onChange={e => setData('entry_year', parseInt(e.target.value))}
                                            />
                                            <span className="text-slate-300 font-black">/</span>
                                            <input
                                                type="number"
                                                className={`${inputClasses()} text-center`}
                                                value={data.graduation_year}
                                                onChange={e => setData('graduation_year', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 3: BERKAS */}
                            <section className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white shadow-sm border border-slate-100 text-amber-600 rounded-2xl">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-800 text-lg">Upload Berkas</h2>
                                            <p className="text-xs text-slate-400">Format PDF atau Gambar (Maks. 10MB)</p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-tighter">Step 03</span>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Dropzone PDF */}
                                    <div className="relative group">
                                        <label className={`block p-10 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer text-center 
                                            ${data.scientific_paper_path ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}`}>
                                            <div className="flex flex-col items-center">
                                                <div className={`p-5 rounded-2xl mb-4 transition-transform group-hover:scale-110 shadow-sm ${data.scientific_paper_path ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                    <UploadCloud size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 mb-1">
                                                    {data.scientific_paper_path ? 'Karya Ilmiah Terlampir' : 'Klik untuk Upload Karya Ilmiah'}
                                                </p>
                                                <p className="text-xs text-slate-400">Harus dalam format PDF (Wajib)</p>

                                                {data.scientific_paper_path && (
                                                    <div className="mt-4 px-4 py-2 bg-white rounded-xl border border-emerald-200 flex items-center gap-3 shadow-sm">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <span className="text-xs font-semibold text-emerald-700 truncate max-w-[300px]">
                                                            {data.scientific_paper_path.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={e => setData('scientific_paper_path', e.target.files ? e.target.files[0] : null)}
                                                accept=".pdf"
                                                required
                                            />
                                        </label>
                                        {errors.scientific_paper_path && <p className="mt-2 text-xs text-red-500 text-center">{errors.scientific_paper_path}</p>}
                                    </div>

                                    {/* Secondary Uploads */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] transition-all hover:bg-white hover:shadow-sm">
                                            <InputLabel icon={ShieldCheck}>Scan KTM (JPG/PNG)</InputLabel>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                                                onChange={e => setData('ktm_scan_path', e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                                required
                                            />
                                        </div>
                                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] transition-all hover:bg-white hover:shadow-sm">
                                            <InputLabel icon={FileText}>Bukti Unggah (Optional)</InputLabel>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:bg-slate-200 file:text-slate-600 hover:file:bg-slate-300 transition-all cursor-pointer"
                                                onChange={e => setData('upload_proof_path', e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Footer Submit Area */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px]"></div>

                                <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex gap-6 max-w-lg">
                                        <div className="flex-shrink-0 p-4 bg-white/10 rounded-2xl text-amber-400 border border-white/5 h-fit shadow-inner">
                                            <AlertCircle size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-xl mb-2 tracking-tight">Pernyataan Integritas</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                Saya menjamin seluruh data dan berkas yang dikirimkan adalah valid.
                                                Manipulasi data akan berakibat pada pembatalan pengajuan dan sanksi akademik.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-500/30 overflow-hidden relative"
                                    >
                                        {processing ? 'Processing...' : (
                                            <>
                                                Kirim Pengajuan
                                                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </>
                                        )}
                                    </button>
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