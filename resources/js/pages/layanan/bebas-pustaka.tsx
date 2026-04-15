import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { Head, Link } from '@inertiajs/react';

import {
    FileCheck,
    History,
    GraduationCap,
    AlertCircle,
    Download,
    CheckCircle2
} from 'lucide-react';

export default function Clearance() {
    const clearanceSteps = [
        {
            title: "Pengecekan Pinjaman",
            icon: <History className="text-amber-600" />,
            steps: [
                "Pastikan tidak memiliki pinjaman buku aktif.",
                "Selesaikan semua denda keterlambatan jika ada.",
                "Buku yang hilang wajib diganti sesuai ketentuan.",
                "Cek status secara mandiri di portal anggota."
            ],
        },
        {
            title: "Penyerahan Karya",
            icon: <GraduationCap className="text-indigo-600" />,
            steps: [
                "Unggah softcopy skripsi/Tugas Akhir ke repositori.",
                "Serahkan hardcopy yang sudah ditandatangani.",
                "Lampirkan abstrak dalam Bahasa Indonesia & Inggris.",
                "Pastikan format CD/Flashdisk sesuai standar."
            ],
        },
        {
            title: "Penerbitan Surat",
            icon: <FileCheck className="text-emerald-600" />,
            steps: [
                "Proses verifikasi oleh staf perpustakaan.",
                "Surat keterangan asli akan diterbitkan.",
                "Digital signature tersedia untuk validasi online.",
                "Surat berlaku sebagai syarat yudisium/wisuda."
            ],
        }
    ];

    return (
        <>
            <Head title="Bebas Pustaka - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION */}
                        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 md:p-16 mb-12 shadow-sm text-center">
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                                    Bebas <span className="text-amber-500">Pustaka</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-400">
                                    Panduan dan prosedur pengurusan surat keterangan bebas pinjaman bagi mahasiswa sebagai syarat kelulusan dan pengambilan ijazah.
                                </p>
                            </div>
                        </section>

                        {/* STEPS PROCEDURES */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            {clearanceSteps.map((rule, index) => (
                                <div key={index} className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {rule.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{rule.title}</h3>
                                    <ul className="space-y-4">
                                        {rule.steps.map((step, sIndex) => (
                                            <li key={sIndex} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                <CheckCircle2 size={16} className="text-indigo-400 mt-1 shrink-0" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* INFORMASI PENTING (Kiri) */}
                            <div className="lg:col-span-2">
                                <section className="rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm h-full">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <AlertCircle className="text-amber-500" /> Informasi Penting
                                    </h2>
                                    <div className="prose prose-slate max-w-none text-slate-600">
                                        <p className="mb-4 font-medium text-slate-800">Harap diperhatikan sebelum mengajukan:</p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm">
                                            <li>Pengurusan bebas pustaka dilakukan maksimal 2 minggu sebelum yudisium.</li>
                                            <li>Sumbangan buku alumni (jika ada kebijakan) harus dalam kondisi baru dan sesuai bidang studi.</li>
                                            <li>Pastikan akun Repositori institusi Anda sudah diverifikasi oleh pembimbing.</li>
                                            <li>Dokumen fisik yang diserahkan harus menggunakan jilid <b>hardcover</b> warna sesuai standar fakultas.</li>
                                        </ul>

                                        <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                                            <Download className="text-indigo-600 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-indigo-900">Formulir Bebas Pustaka</p>
                                                <p className="text-xs text-indigo-600">Unduh draft surat pernyataan (PDF/DOCX)</p>
                                            </div>
                                            <button className="text-xs bg-white px-4 py-2 rounded-xl font-bold border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm">
                                                Unduh
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* STATUS PENGAJUAN (Kanan) */}
                            <div className="lg:col-span-1">
                                <div className="rounded-[2rem] bg-amber-500 p-8 text-white shadow-lg shadow-amber-200 h-full flex flex-col justify-center">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <FileCheck className="text-amber-100" /> Ajukan Secara Online
                                    </h3>
                                    <p className="text-amber-50 text-sm mb-8 leading-relaxed">
                                        Malas antre? Sekarang Anda bisa mengajukan validasi bebas pustaka secara digital melalui sistem informasi kami.
                                    </p>

                                    <Link
                                        href="/layanan/form-bebas-pustaka"
                                        className="w-full py-4 px-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-lg text-center block"
                                    >
                                        Mulai Pengajuan Digital
                                    </Link>

                                    <p className="mt-6 text-[10px] text-center text-amber-100 uppercase tracking-widest font-bold">
                                        Estimasi Proses: 1-2 Hari Kerja
                                    </p>
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