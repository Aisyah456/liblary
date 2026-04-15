import { Head, useForm, usePage } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import {
    FileUp, Send, User, BookText, AlertCircle,
    Mail, Hash, GraduationCap, Info
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
import { route as ziggyRoute } from 'ziggy-js';


declare var route: any;

// --- Interfaces ---
interface Major {
    id: number;
    name: string;
}

interface Faculty {
    id: number;
    name: string;
    majors: Major[];
}

interface PageProps {
    auth: { user: any };
    faculties: Faculty[];
    flash: {
        message?: {
            type: 'success' | 'error' | 'warning';
            text: string;
        };
    };
}

export default function TurnitinSubmission() {

    const { auth, faculties, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        identifier_id: '',
        full_name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        faculty_id: '',
        major_id: '',
        title: '',
        document_type: '',
        file_path: null as File | null,
        academic_year: '2025/2026',
    });

    // Filter program studi berdasarkan fakultas yang dipilih
    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        const faculty = faculties.find(f => f.id.toString() === data.faculty_id.toString());
        return faculty ? faculty.majors : [];
    }, [data.faculty_id, faculties]);

    // Handle notifikasi flash dari session Laravel
    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                title: flash.message.type === 'success' ? 'Berhasil!' : 'Oops!',
                text: flash.message.text,
                icon: flash.message.type,
                confirmButtonColor: '#0d9488',
            });
        }
    }, [flash]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            // Validasi client-side: 10MB
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire('File Terlalu Besar', 'Maksimal ukuran file adalah 10MB', 'error');
                e.target.value = '';
                return;
            }
            setData('file_path', file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Menggunakan helper route() global
        post(route('form-cek-turnitin.store'), {
            forceFormData: true, // Wajib untuk upload file di Laravel/Inertia
            onSuccess: () => {
                reset('file_path', 'title', 'document_type');
                Swal.fire({
                    title: 'Berhasil Terkirim!',
                    text: 'Dokumen Anda sedang dalam antrean verifikasi admin.',
                    icon: 'success',
                    confirmButtonColor: '#0d9488',
                });
            },
            onError: (err) => {
                console.error("Submission Error:", err);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Silakan periksa kembali formulir Anda atau pastikan format file benar.',
                    icon: 'error',
                    confirmButtonColor: '#e11d48',
                });
            }
        });
    };

    return (
        <>
            <Head title="Ajukan Cek Turnitin - Perpustakaan UMHT" />

            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar auth={auth} />

                <main className="pt-32 pb-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">

                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                Form <span className="text-teal-600 italic">Turnitin</span> Submission
                            </h1>
                            <p className="text-slate-500 max-w-xl leading-relaxed">
                                Silakan lengkapi data di bawah ini untuk melakukan pengecekan orisinalitas karya ilmiah melalui sistem Turnitin.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* KOLOM KIRI: INPUT DATA */}
                            <div className="lg:col-span-8 space-y-6">

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
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fakultas</label>
                                            <select
                                                disabled={processing}
                                                className={`w-full py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.faculty_id ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                                value={data.faculty_id}
                                                onChange={e => {
                                                    setData(prev => ({ ...prev, faculty_id: e.target.value, major_id: '' }));
                                                }}
                                            >
                                                <option value="">Pilih Fakultas</option>
                                                {faculties?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                                            </select>
                                            {errors.faculty_id && <p className="text-xs text-rose-500 mt-1">{errors.faculty_id}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Program Studi</label>
                                            <select
                                                disabled={!data.faculty_id || processing}
                                                className={`w-full py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 ${errors.major_id ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                                value={data.major_id}
                                                onChange={e => setData('major_id', e.target.value)}
                                            >
                                                <option value="">{!data.faculty_id ? 'Pilih Fakultas Terlebih Dahulu' : 'Pilih Program Studi'}</option>
                                                {filteredMajors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                            {errors.major_id && <p className="text-xs text-rose-500 mt-1">{errors.major_id}</p>}
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
                                                className={`w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30 p-4 ${errors.title ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                                placeholder="Contoh: Analisis Keamanan Jaringan..."
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
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
                                                {errors.document_type && <p className="text-xs text-rose-500">{errors.document_type}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tahun Akademik</label>
                                                <input
                                                    type="text"
                                                    disabled={processing}
                                                    className="w-full py-3 rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/30"
                                                    value={data.academic_year}
                                                    onChange={e => setData('academic_year', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">File Dokumen</label>
                                            <div className="mt-2 group relative">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="file_path"
                                                    disabled={processing}
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor="file_path"
                                                    className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${data.file_path
                                                        ? 'border-teal-500 bg-teal-50/30'
                                                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400'
                                                        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="flex flex-col items-center text-center p-6">
                                                        <div className={`p-3 rounded-full mb-3 ${data.file_path ? 'bg-teal-100 text-teal-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                            <FileUp size={24} />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-700">
                                                            {data.file_path ? data.file_path.name : 'Klik untuk pilih file'}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, atau DOCX (Max. 10MB)</p>
                                                    </div>
                                                </label>
                                            </div>
                                            {errors.file_path && <p className="text-xs text-rose-500 mt-2">{errors.file_path}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN: STATUS & ACTION */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-32 shadow-2xl">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className={`w-2 h-2 rounded-full ${processing ? 'bg-amber-400 animate-bounce' : 'bg-teal-400 animate-pulse'}`}></div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            {processing ? 'Sedang Memproses' : 'Sistem Siap'}
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-lg font-bold mb-2">Ready to Process</h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                Pastikan semua data sudah benar. File akan segera masuk ke antrean verifikasi admin perpustakaan.
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className="bg-slate-800 p-1.5 rounded-md"><Info size={14} className="text-teal-400" /></div>
                                                <span>Hasil via Email & Dashboard</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className="bg-slate-800 p-1.5 rounded-md"><GraduationCap size={14} className="text-teal-400" /></div>
                                                <span>Berlaku untuk Sidang/Yudisium</span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-teal-400 transition-all active:scale-[0.98] disabled:opacity-50 mt-8 group"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                                    MENGIRIM...
                                                </>
                                            ) : (
                                                <>SUBMIT NOW <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                            )}
                                        </button>

                                        <div className="flex items-start gap-2 pt-4 border-t border-slate-800">
                                            <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                                Nama file wajib menggunakan format: <strong>NIM_NAMA</strong> (Tanpa spasi/karakter khusus).
                                            </p>
                                        </div>
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