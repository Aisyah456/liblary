import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import {
    Send,
    UploadCloud,
    User,
    GraduationCap,
    FileText,
    AlertCircle
} from 'lucide-react';

export default function LibraryFreeForm({ faculties, majors }) {
    // Inisialisasi useForm dari Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        nim: '',
        phone_number: '',
        email: '',
        faculty_id: '',
        major_id: '',
        degree_level: '',
        purpose: 'Yudisium', // default
        entry_year: new Date().getFullYear() - 4,
        graduation_year: new Date().getFullYear(),
        scientific_paper_path: null,
        ktm_scan_path: null,
        upload_proof_path: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('library-free.store'), {
            forceFormData: true, // Penting untuk upload file
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Pengajuan Bebas Pustaka - Perpustakaan UMHT" />
            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">

                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                                Formulir <span className="text-indigo-600">Bebas Pustaka</span>
                            </h1>
                            <p className="text-slate-600">Lengkapi data di bawah ini dengan benar untuk memproses surat keterangan Anda.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* SECTION 1: DATA DIRI */}
                            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <User className="text-indigo-600" size={20} /> Informasi Mahasiswa
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Sesuai Ijazah"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                        />
                                        {errors.full_name && <p className="text-xs text-rose-500 font-medium">{errors.full_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">NIM</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Nomor Induk Mahasiswa"
                                            value={data.nim}
                                            onChange={e => setData('nim', e.target.value)}
                                        />
                                        {errors.nim && <p className="text-xs text-rose-500 font-medium">{errors.nim}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Kampus</label>
                                        <input
                                            type="email"
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="mhs@umht.ac.id"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">No. WhatsApp</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="0812..."
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                        />
                                        {errors.phone_number && <p className="text-xs text-rose-500 font-medium">{errors.phone_number}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: AKADEMIK */}
                            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <GraduationCap className="text-indigo-600" size={20} /> Relasi Akademik
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Fakultas</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.faculty_id}
                                            onChange={e => setData('faculty_id', e.target.value)}
                                        >
                                            <option value="">Pilih Fakultas</option>
                                            {faculties?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Program Studi</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.major_id}
                                            onChange={e => setData('major_id', e.target.value)}
                                        >
                                            <option value="">Pilih Prodi</option>
                                            {majors?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Jenjang</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.degree_level}
                                            onChange={e => setData('degree_level', e.target.value)}
                                        >
                                            <option value="">Pilih Jenjang</option>
                                            <option value="D3">Diploma (D3)</option>
                                            <option value="S1">Sarjana (S1)</option>
                                            <option value="S2">Magister (S2)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: UPLOAD FILE */}
                            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <FileText className="text-indigo-600" size={20} /> Berkas Pendukung
                                </h2>
                                <div className="space-y-6">
                                    {/* Upload Karya Ilmiah */}
                                    <div className="relative group">
                                        <label className="block p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 transition-colors cursor-pointer text-center">
                                            <UploadCloud className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-2" size={32} />
                                            <span className="text-sm font-medium text-slate-600 block">Klik untuk unggah Karya Ilmiah (.PDF)</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Maksimal 10MB</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={e => setData('scientific_paper_path', e.target.files[0])}
                                                accept=".pdf"
                                            />
                                        </label>
                                        {data.scientific_paper_path && (
                                            <p className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                                                ✓ {data.scientific_paper_path.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Scan KTM (JPG/PNG)</label>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                onChange={e => setData('ktm_scan_path', e.target.files[0])}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Bukti Upload Repositori (Opsional)</label>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-700"
                                                onChange={e => setData('upload_proof_path', e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Area */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                                <div className="flex gap-4">
                                    <AlertCircle className="text-indigo-600 shrink-0" />
                                    <p className="text-xs text-indigo-700 leading-relaxed italic">
                                        Dengan menekan tombol submit, saya menyatakan bahwa data yang saya input adalah benar dan karya ilmiah tersebut merupakan karya asli saya sendiri.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : (
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