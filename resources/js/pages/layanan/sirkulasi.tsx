import { Head } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import {
    BookOpen,
    RefreshCcw,
    ArrowLeftRight,
    Calendar,
    ClipboardCheck
} from 'lucide-react';

export default function Circulation() {
    const circulationRules = [
        {
            title: "Peminjaman",
            icon: <BookOpen className="text-indigo-600" />,
            steps: [
                "Membawa Kartu Tanda Mahasiswa (KTM) yang aktif.",
                "Mencari buku melalui OPAC (Online Public Access Catalog).",
                "Maksimal peminjaman adalah 3 buku dalam satu waktu.",
                "Membawa buku ke meja sirkulasi untuk diproses oleh staf."
            ],
            color: "bg-white"
        },
        {
            title: "Pengembalian",
            icon: <ArrowLeftRight className="text-emerald-600" />,
            steps: [
                "Menyerahkan buku ke meja sirkulasi tepat waktu.",
                "Pastikan kondisi buku sama seperti saat dipinjam.",
                "Staf akan melakukan scan untuk memperbarui status koleksi.",
                "Denda berlaku jika pengembalian melewati batas tanggal."
            ],
            color: "bg-white"
        },
        {
            title: "Perpanjangan",
            icon: <RefreshCcw className="text-blue-600" />,
            steps: [
                "Perpanjangan dapat dilakukan 1x untuk jangka waktu 7 hari.",
                "Bisa dilakukan secara mandiri melalui area anggota (web) atau lapor staf.",
                "Tidak berlaku jika buku sudah dipesan (reserved) oleh orang lain.",
                "Wajib dilakukan sebelum masa pinjam berakhir."
            ],
            color: "bg-white"
        }
    ];

    return (
        <>
            <Head title="Sirkulasi - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/5 border border-slate-200/60 backdrop-blur-md p-8 md:p-16 mb-12 shadow-sm text-center">
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                                    Layanan <span className="text-indigo-600">Sirkulasi</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                                    Informasi lengkap mengenai prosedur peminjaman, pengembalian, dan perpanjangan koleksi fisik Perpustakaan UMHT.
                                </p>
                            </div>
                        </div>

                        {/* MAIN PROCEDURES */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            {circulationRules.map((rule, index) => (
                                <div key={index} className={`rounded-[2rem] ${rule.color} border border-slate-200 p-8 shadow-sm transition-all hover:shadow-md`}>
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                                        {rule.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{rule.title}</h3>
                                    <ul className="space-y-4">
                                        {rule.steps.map((step, sIndex) => (
                                            <li key={sIndex} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* KETENTUAN WAKTU & KUOTA (Kiri) */}
                            <div className="lg:col-span-2">
                                <section className="rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm h-full">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <Calendar className="text-indigo-600" /> Ketentuan Waktu & Kuota
                                    </h2>
                                    <div className="overflow-hidden rounded-xl border border-slate-100">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Maksimal Buku</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durasi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100 text-sm text-slate-600">
                                                <tr>
                                                    <td className="px-6 py-4 font-medium text-slate-900">Mahasiswa</td>
                                                    <td className="px-6 py-4">3 Judul</td>
                                                    <td className="px-6 py-4">7 Hari</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium text-slate-900">Dosen / Staf</td>
                                                    <td className="px-6 py-4">5 Judul</td>
                                                    <td className="px-6 py-4">14 Hari</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>

                            {/* CEK STATUS (Kanan) */}
                            <div className="lg:col-span-1">
                                <div className="rounded-[2rem] bg-indigo-600 p-8 text-white shadow-lg shadow-indigo-200 h-full flex flex-col justify-center">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <ClipboardCheck className="text-indigo-200" /> Cek Status Pinjaman
                                    </h3>
                                    <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
                                        Pantau tanggal jatuh tempo dan lakukan perpanjangan mandiri melalui portal anggota kami secara real-time.
                                    </p>
                                    <button className="w-full py-4 px-4 bg-white text-indigo-600 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition-all active:scale-95">
                                        Login Area Anggota
                                    </button>
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