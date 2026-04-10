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
    CheckCircle2
} from 'lucide-react';

interface Faculty {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
    faculty_id: number;
}

interface Props {
    faculties: Faculty[];
    majors: Major[];
}

export default function LibraryFreeForm({ faculties, majors }: Props) {
    // Definisi Form dengan Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
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
        scientific_paper_path: null as File | null,
        ktm_scan_path: null as File | null,
        upload_proof_path: null as File | null,
    });

    // Filter prodi berdasarkan fakultas yang dipilih
    const filteredMajors = useMemo(() => {
        if (!data.faculty_id) return [];
        return majors.filter(major => major.faculty_id === parseInt(data.faculty_id));
    }, [data.faculty_id, majors]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Catatan: Pastikan di Controller menggunakan Request->file() 
        // karena Inertia akan otomatis mengubah ke FormData jika ada File
        post(route('library-free.store'), {
            forceFormData: true,
            onSuccess: () => {
                alert('Pengajuan berhasil dikirim!');
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Pengajuan Bebas Pustaka - Perpustakaan UMHT" />
            <div className="min-h-screen bg-slate-50/50">
                <Navbar />

                <main className="pt-32 pb-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                                Formulir <span className="text-indigo-600">Bebas Pustaka</span>
                            </h1>
                            <p className="text-slate-600">Lengkapi data di bawah ini dengan benar untuk memproses surat keterangan Anda.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* SECTION 1: DATA DIRI */}
                            <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm transition-all hover:border-indigo-100">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <User className="text-indigo-600" size={20} /> Informasi Mahasiswa
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className={`w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.full_name ? 'border-rose-500' : ''}`}
                                            placeholder="Sesuai Ijazah"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                            required
                                        />
                                        {errors.full_name && <p className="text-xs text-rose-500 font-medium">{errors.full_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">NIM</label>
                                        <input
                                            type="text"
                                            className={`w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 ${errors.nim ? 'border-rose-500' : ''}`}
                                            placeholder="Nomor Induk Mahasiswa"
                                            value={data.nim}
                                            onChange={e => setData('nim', e.target.value)}
                                            required
                                        />
                                        {errors.nim && <p className="text-xs text-rose-500 font-medium">{errors.nim}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Kampus</label>
                                        <input
                                            type="email"
                                            className={`w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-rose-500' : ''}`}
                                            placeholder="mhs@umht.ac.id"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">No. WhatsApp</label>
                                        <input
                                            type="tel"
                                            className={`w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone_number ? 'border-rose-500' : ''}`}
                                            placeholder="0812..."
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            required
                                        />
                                        {errors.phone_number && <p className="text-xs text-rose-500 font-medium">{errors.phone_number}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: AKADEMIK */}
                            <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <GraduationCap className="text-indigo-600" size={20} /> Relasi Akademik
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Fakultas</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.faculty_id}
                                            onChange={e => {
                                                setData(d => ({ ...d, faculty_id: e.target.value, major_id: '' }));
                                            }}
                                            required
                                        >
                                            <option value="">Pilih Fakultas</option>
                                            {faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Program Studi</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                            value={data.major_id}
                                            disabled={!data.faculty_id}
                                            onChange={e => setData('major_id', e.target.value)}
                                            required
                                        >
                                            <option value="">{data.faculty_id ? 'Pilih Prodi' : 'Pilih Fakultas Dulu'}</option>
                                            {filteredMajors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Jenjang</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.degree_level}
                                            onChange={e => setData('degree_level', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Jenjang</option>
                                            <option value="D3">Diploma (D3)</option>
                                            <option value="S1">Sarjana (S1)</option>
                                            <option value="S2">Magister (S2)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 3: UPLOAD FILE */}
                            <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <FileText className="text-indigo-600" size={20} /> Berkas Pendukung
                                </h2>
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className={`block p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center 
                                            ${data.scientific_paper_path ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-indigo-400'}`}>
                                            <UploadCloud className={`mx-auto mb-2 ${data.scientific_paper_path ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-500'}`} size={32} />
                                            <span className="text-sm font-semibold text-slate-700 block">
                                                {data.scientific_paper_path ? 'Karya Ilmiah Terpilih' : 'Klik untuk unggah Karya Ilmiah (.PDF)'}
                                            </span>
                                            {data.scientific_paper_path && (
                                                <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
                                                    <CheckCircle2 size={14} /> {(data.scientific_paper_path as File).name}
                                                </span>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={e => setData('scientific_paper_path', e.target.files ? e.target.files[0] : null)}
                                                accept=".pdf"
                                            />
                                        </label>
                                        {errors.scientific_paper_path && <p className="text-xs text-rose-500 mt-2 font-medium">{errors.scientific_paper_path}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <label className="text-sm font-semibold text-slate-700 block mb-2">Scan KTM (JPG/PNG)</label>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                onChange={e => setData('ktm_scan_path', e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                            />
                                            {errors.ktm_scan_path && <p className="text-xs text-rose-500 mt-1">{errors.ktm_scan_path}</p>}
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <label className="text-sm font-semibold text-slate-700 block mb-2">Bukti Repositori (Opsional)</label>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                                                onChange={e => setData('upload_proof_path', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Submit Area */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-indigo-100">
                                <div className="flex gap-4 max-w-md">
                                    <AlertCircle className="text-amber-400 shrink-0" />
                                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                                        Saya menyatakan bahwa data yang diinput adalah benar dan dokumen yang diunggah adalah karya asli saya. Ketidaksesuaian data dapat membatalkan pengajuan ini.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto px-10 py-4 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {processing ? 'Sedang Mengirim...' : (
                                        <>Kirim Pengajuan <Send size={18} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}