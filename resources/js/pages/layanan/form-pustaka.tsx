import Footer from '@/Components/home/Footer';
import Navbar from '@/Components/home/Navbar';
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
    Hash
} from 'lucide-react';

interface Faculty {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
    faculty_id: number;
    degree_level: string;
}

interface Props {
    faculties: Faculty[];
    majors: Major[];
}

export default function LibraryFreeForm({ faculties, majors }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
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
        scientific_paper_path: null as File | null,
        ktm_scan_path: null as File | null,
        upload_proof_path: null as File | null,
    });

    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        return majors.filter(major => major.faculty_id === parseInt(data.faculty_id));
    }, [data.faculty_id, majors]);

    const handleMajorChange = (id: string) => {
        const selectedMajor = majors.find(m => m.id === parseInt(id));
        setData(d => ({
            ...d,
            major_id: id,
            degree_level: selectedMajor ? selectedMajor.degree_level : ''
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('library-free.store'), {
            forceFormData: true,
            onSuccess: () => {
                alert('Pengajuan berhasil dikirim!');
                reset();
            },
        });
    };

    // Helper component untuk Input Label
    const InputLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5">
            {Icon && <Icon size={12} className="text-slate-400" />}
            {children}
        </label>
    );

    return (
        <>
            <Head title="Pengajuan Bebas Pustaka - UMHT" />
            <div className="min-h-screen bg-[#FDFDFD]">
                <Navbar />

                <main className="pt-32 pb-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                Student Services
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                Bebas <span className="text-indigo-600">Pustaka</span>
                            </h1>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Form pengajuan surat keterangan bebas pinjam perpustakaan untuk keperluan yudisium dan administrasi kelulusan.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* SECTION 1: IDENTITAS */}
                            <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white shadow-sm border border-slate-100 text-indigo-600 rounded-xl">
                                            <User size={20} />
                                        </div>
                                        <h2 className="font-bold text-slate-800">Identitas Mahasiswa</h2>
                                    </div>
                                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">BAGIAN 01</span>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="group">
                                        <InputLabel icon={User}>Nama Lengkap</InputLabel>
                                        <input
                                            type="text"
                                            className={`w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300 ${errors.full_name ? 'border-red-400 ring-4 ring-red-500/5' : ''}`}
                                            placeholder="Nama lengkap sesuai ijazah"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                            required
                                        />
                                        {errors.full_name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.full_name}</p>}
                                    </div>

                                    <div>
                                        <InputLabel icon={Hash}>NIM</InputLabel>
                                        <input
                                            type="text"
                                            className={`w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all ${errors.nim ? 'border-red-400 ring-4 ring-red-500/5' : ''}`}
                                            placeholder="Nomor Induk Mahasiswa"
                                            value={data.nim}
                                            onChange={e => setData('nim', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <InputLabel icon={Mail}>Email Aktif</InputLabel>
                                        <input
                                            type="email"
                                            className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                            placeholder="mahasiswa@umht.ac.id"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <InputLabel icon={Phone}>No. WhatsApp</InputLabel>
                                        <input
                                            type="tel"
                                            className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                            placeholder="081234567xxx"
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: AKADEMIK */}
                            <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white shadow-sm border border-slate-100 text-emerald-600 rounded-xl">
                                            <GraduationCap size={20} />
                                        </div>
                                        <h2 className="font-bold text-slate-800">Status Akademik</h2>
                                    </div>
                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">BAGIAN 02</span>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="md:col-span-1">
                                        <InputLabel>Fakultas</InputLabel>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                                            value={data.faculty_id}
                                            onChange={e => setData(d => ({ ...d, faculty_id: e.target.value, major_id: '', degree_level: '' }))}
                                            required
                                        >
                                            <option value="">Pilih Fakultas</option>
                                            {faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel>Program Studi</InputLabel>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                                            value={data.major_id}
                                            disabled={!data.faculty_id}
                                            onChange={e => handleMajorChange(e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            {filteredMajors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel>Jenjang</InputLabel>
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full rounded-xl bg-slate-50 border-slate-200 text-slate-500 font-bold text-center"
                                                value={data.degree_level || '-'}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel>Keperluan</InputLabel>
                                            <select
                                                className="w-full rounded-xl border-slate-200 focus:border-indigo-500"
                                                value={data.purpose}
                                                onChange={e => setData('purpose', e.target.value)}
                                            >
                                                <option value="Yudisium">Yudisium</option>
                                                <option value="Wisuda">Wisuda</option>
                                                <option value="Pindah Kampus">Pindah</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel icon={Calendar}>Tahun Masuk — Lulus</InputLabel>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                className="w-full rounded-xl border-slate-200 focus:border-indigo-500 text-center"
                                                value={data.entry_year}
                                                onChange={e => setData('entry_year', parseInt(e.target.value))}
                                            />
                                            <span className="text-slate-300 font-bold">/</span>
                                            <input
                                                type="number"
                                                className="w-full rounded-xl border-slate-200 focus:border-indigo-500 text-center"
                                                value={data.graduation_year}
                                                onChange={e => setData('graduation_year', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 3: BERKAS */}
                            <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white shadow-sm border border-slate-100 text-amber-600 rounded-xl">
                                            <FileText size={20} />
                                        </div>
                                        <h2 className="font-bold text-slate-800">Berkas Pendukung</h2>
                                    </div>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md">BAGIAN 03</span>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Upload Area Utama */}
                                    <div className="relative group">
                                        <label className={`block p-8 border-2 border-dashed rounded-[1.5rem] transition-all cursor-pointer text-center 
                                            ${data.scientific_paper_path ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80'}`}>
                                            <div className="flex flex-col items-center">
                                                <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${data.scientific_paper_path ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:text-indigo-500'}`}>
                                                    <UploadCloud size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {data.scientific_paper_path ? 'Karya Ilmiah Berhasil Dipilih' : 'Klik atau seret File Karya Ilmiah (PDF)'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2">Format PDF, Ukuran Maksimal 10MB</p>

                                                {data.scientific_paper_path && (
                                                    <div className="mt-4 px-4 py-2 bg-white rounded-xl border border-emerald-200 flex items-center gap-3 shadow-sm">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <span className="text-xs font-semibold text-emerald-700 truncate max-w-[250px]">
                                                            {(data.scientific_paper_path as File).name}
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
                                    </div>

                                    {/* Secondary Uploads */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                                            <InputLabel>Scan KTM (Wajib)</InputLabel>
                                            <input
                                                type="file"
                                                className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                                                onChange={e => setData('ktm_scan_path', e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                                required
                                            />
                                        </div>
                                        <div className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                                            <InputLabel>Bukti Upload (Opsional)</InputLabel>
                                            <input
                                                type="file"
                                                className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-600 hover:file:bg-slate-300 transition-all"
                                                onChange={e => setData('upload_proof_path', e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Action Area */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[80px]"></div>

                                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex gap-5">
                                        <div className="p-3.5 bg-white/10 rounded-2xl text-amber-400 h-fit">
                                            <AlertCircle size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Pernyataan Integritas</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                                Saya menjamin seluruh data valid. Segala bentuk manipulasi akan dikenakan sanksi akademik sesuai aturan UMHT.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
                                    >
                                        {processing ? 'Sedang Mengirim...' : (
                                            <>Kirim Pengajuan <Send size={20} /></>
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