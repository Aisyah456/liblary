import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import {
    FileUp,
    Send,
    User,
    BookText,
    GraduationCap,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { route } from 'ziggy-js';

export default function TurnitinSubmission({ auth, prodis }: { auth: any; prodis: any }) {
    // Inisialisasi form sesuai dengan kolom di tabel submissions
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier_id: '', // NIM atau NIDN
        full_name: auth?.user?.name || '', // Default dari auth user jika ada
        title: '',
        document_type: '',
        file_path: null as File | null,
        academic_year: '2025/2026', // Contoh default
        prodi: '',
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post(route('turnitin.store'), {
            forceFormData: true, // Wajib true karena ada upload file_path
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Ajukan Cek Turnitin - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={auth} />

                <main className="pt-32 pb-20">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">

                        {/* Header Section */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                                Form <span className="text-teal-600">Pengecekan Orisinalitas</span>
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Pastikan dokumen yang Anda unggah adalah versi final yang akan disidangkan atau dipublikasikan.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* KARTU 1: IDENTITAS */}
                            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <User size={18} /> Informasi Pengaju
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">NIM / NIDN</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Contoh: 202101001"
                                            value={data.identifier_id}
                                            onChange={e => setData('identifier_id', e.target.value)}
                                        />
                                        {errors.identifier_id && <p className="text-xs text-rose-500">{errors.identifier_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Nama Sesuai SIAKAD"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                        />
                                        {errors.full_name && <p className="text-xs text-rose-500">{errors.full_name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Program Studi</label>
                                        <select
                                            className="w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                                            value={data.prodi}
                                            onChange={e => setData('prodi', e.target.value)}
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            <option value="Informatika">S1 Informatika</option>
                                            <option value="Sistem Informasi">S1 Sistem Informasi</option>
                                            <option value="Kesehatan Masyarakat">S1 Kesehatan Masyarakat</option>
                                            {/* Anda bisa memetakan dari props prodis jika ada */}
                                        </select>
                                        {errors.prodi && <p className="text-xs text-rose-500">{errors.prodi}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Tahun Akademik</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Contoh: 2025/2026"
                                            value={data.academic_year}
                                            onChange={e => setData('academic_year', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KARTU 2: DOKUMEN */}
                            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <BookText size={18} /> Detail Karya Ilmiah
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Judul Lengkap Karya</label>
                                        <textarea
                                            rows={2}
                                            className="w-full rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Masukkan judul lengkap tanpa singkatan..."
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                        />
                                        {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Jenis Dokumen</label>
                                            <div className="flex gap-4 mt-2">
                                                {['Skripsi', 'Tesis', 'Artikel'].map((type) => (
                                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="document_type"
                                                            value={type}
                                                            className="text-teal-600 focus:ring-teal-500"
                                                            onChange={e => setData('document_type', e.target.value)}
                                                        />
                                                        <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.document_type && <p className="text-xs text-rose-500">{errors.document_type}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Unggah File (.doc, .docx, .pdf)</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="file_path"
                                                    onChange={e => setData('file_path', e.target.files?.[0] || null)}
                                                />
                                                <label
                                                    htmlFor="file_path"
                                                    className="flex items-center justify-between w-full px-4 py-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all"
                                                >
                                                    <span className="text-xs text-slate-500 truncate">
                                                        {data.file_path ? data.file_path.name : 'Pilih file karya ilmiah...'}
                                                    </span>
                                                    <FileUp size={18} className="text-teal-500" />
                                                </label>
                                            </div>
                                            {errors.file_path && <p className="text-xs text-rose-500">{errors.file_path}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-700 transition-all active:scale-[0.98] shadow-lg shadow-teal-200 disabled:opacity-50"
                                >
                                    {processing ? 'Sedang Mengunggah...' : (
                                        <>Kirim ke Turnitin <Send size={18} /></>
                                    )}
                                </button>

                                <div className="flex items-start gap-2 px-4">
                                    <AlertCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                        Status pengajuan Anda akan berubah dari <span className="text-amber-500 font-bold">Pending</span> ke <span className="text-teal-500 font-bold">Completed</span> setelah admin selesai melakukan pengecekan. Hasil akan dikirim otomatis ke email Anda.
                                    </p>
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