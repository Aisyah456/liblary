import Footer from '@/Components/home/Footer';
import Navbar from '@/Components/home/Navbar';
import { Head, Link } from '@inertiajs/react'; // Tambahkan Link di sini


import {
    ShieldCheck,
    FileSearch,
    FileUp,
    AlertCircle,
    CheckCircle2,
    Info,
    Percent
} from 'lucide-react';

export default function TurnitinService({ auth }: { auth: any }) {
    const turnitinSteps = [
        {
            title: "Pengiriman Berkas",
            icon: <FileUp className="text-teal-600" size={28} />,
            steps: [
                "Pastikan file dalam format .doc, .docx, atau .pdf.",
                "Ukuran file maksimal 20MB.",
                "Kirim berkas melalui form online di portal ini.",
                "Sertakan Nama, NIM, dan Judul Karya Ilmiah."
            ]
        },
        {
            title: "Proses Pengecekan",
            icon: <FileSearch className="text-blue-600" size={28} />,
            steps: [
                "Pengecekan dilakukan oleh admin perpustakaan.",
                "Proses memakan waktu 1x24 jam pada hari kerja.",
                "Menggunakan database Turnitin global & repositori lokal.",
                "Filter pengecualian (quotes & bibliography) diterapkan."
            ]
        },
        {
            title: "Hasil & Sertifikasi",
            icon: <ShieldCheck className="text-emerald-600" size={28} />,
            steps: [
                "Laporan 'Similarity Report' dikirim via email.",
                "Skor maksimal yang diizinkan sesuai kebijakan prodi.",
                "Diberikan sertifikat bukti cek plagiarisme.",
                "Hasil dapat digunakan untuk syarat sidang/jurnal."
            ]
        }
    ];

    return (
        <>
            <Head title="Layanan Turnitin - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={auth} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-teal-900 border border-teal-800 p-8 md:p-16 mb-12 shadow-sm text-center">
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-widest mb-4 border border-teal-500/30">
                                    Academic Integrity
                                </span>
                                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                                    Cek <span className="text-teal-400">Plagiarisme</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-teal-100/80">
                                    Lindungi integritas akademik Anda dengan layanan pengecekan orisinalitas menggunakan teknologi Turnitin Feedback Studio.
                                </p>
                            </div>
                        </div>

                        {/* MAIN STEPS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            {turnitinSteps.map((step, index) => (
                                <div key={index} className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm transition-all hover:shadow-md group">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{step.title}</h3>
                                    <ul className="space-y-4">
                                        {step.steps.map((text, sIndex) => (
                                            <li key={sIndex} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                <CheckCircle2 size={16} className="text-teal-500 mt-1 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* STANDAR TOLERANSI */}
                            <div className="lg:col-span-2">
                                <section className="rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm h-full">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <Percent className="text-teal-600" /> Standar Similarity
                                    </h2>
                                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Jenis Karya</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Batas Maksimal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100 text-sm text-slate-600">
                                                <tr>
                                                    <td className="px-6 py-4 font-medium text-slate-900">Skripsi / Tugas Akhir</td>
                                                    <td className="px-6 py-4"><span className="py-1 px-3 bg-teal-100 text-teal-700 rounded-full font-bold">25%</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium text-slate-900">Tesis</td>
                                                    <td className="px-6 py-4"><span className="py-1 px-3 bg-blue-100 text-blue-700 rounded-full font-bold">20%</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium text-slate-900">Jurnal / Publikasi</td>
                                                    <td className="px-6 py-4"><span className="py-1 px-3 bg-indigo-100 text-indigo-700 rounded-full font-bold">15%</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            <strong>Catatan:</strong> Batas toleransi dapat berbeda tergantung kebijakan prodi. Konsultasikan dengan dosen pembimbing Anda.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* CTA SECTION */}
                            <div className="lg:col-span-1">
                                <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl h-full flex flex-col justify-between border border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <Info className="text-teal-400" /> Butuh Bantuan?
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                            Jika Anda mengalami kendala dalam proses pengunggahan atau interpretasi hasil, tim kami siap membantu di jam kerja.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        {/* PERBAIKAN: Menggunakan Link untuk navigasi form */}
                                        <Link
                                            href="/layanan/form-cek-turnitin" // Sesuaikan dengan route form pengajuan Anda
                                            className="w-full py-4 px-4 bg-teal-500 text-white rounded-2xl text-sm font-bold hover:bg-teal-400 transition-all active:scale-95 shadow-lg shadow-teal-900/20 text-center block"
                                        >
                                            Ajukan Cek Sekarang
                                        </Link>
                                        <button className="w-full py-4 px-4 bg-slate-800 text-slate-300 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all">
                                            Panduan Interpretasi PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}