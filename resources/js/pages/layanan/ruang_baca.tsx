import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';

import { Head, Link } from '@inertiajs/react'; 

import {
    Coffee,
    Wifi,
    Wind,
    Monitor,
    Info,
    CheckCircle2,
    DoorOpen,
    VolumeX
} from 'lucide-react';

export default function ReadingRoom() {
    const facilities = [
        {
            title: "Area Belajar Mandiri",
            icon: <VolumeX className="text-rose-600" />,
            desc: "Zona tenang yang didesain khusus untuk fokus maksimal tanpa gangguan suara.",
            features: ["Meja Individu", "Stop Kontak", "Lampu Baca"]
        },
        {
            title: "Ruang Diskusi",
            icon: <DoorOpen className="text-indigo-600" />,
            desc: "Ruangan tertutup untuk kerja kelompok atau kolaborasi proyek akademik.",
            features: ["Kapasitas 6-8 Orang", "Papan Tulis", "Smart TV"]
        },
        {
            title: "Fasilitas Digital",
            icon: <Wifi className="text-blue-600" />,
            desc: "Akses internet kecepatan tinggi dan terminal komputer untuk riset jurnal.",
            features: ["WiFi 100Mbps", "PC Desktop", "Akses E-Journal"]
        }
    ];

    return (
        <>
            <Head title="Ruang Baca - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 border border-slate-200/60 p-8 md:p-16 mb-12 shadow-sm text-center">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-200 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-400/20">
                                    Facilities & Comfort
                                </span>
                                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                                    Ruang <span className="text-indigo-400">Baca & Riset</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-indigo-100/80">
                                    Lingkungan belajar yang kondusif dengan fasilitas modern untuk mendukung produktivitas akademik Anda di Perpustakaan UMHT.
                                </p>
                            </div>
                        </div>

                        {/* FACILITY CARDS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            {facilities.map((item, index) => (
                                <div key={index} className="group bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-8">
                                        {item.desc}
                                    </p>
                                    <ul className="space-y-3 pt-6 border-t border-slate-50">
                                        {item.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                <CheckCircle2 size={14} className="text-indigo-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* TATA TERTIB (Kiri) */}
                            <div className="lg:col-span-2">
                                <section className="rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm h-full">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                        <Info className="text-indigo-600" /> Tata Tertib Ruangan
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">01</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Wajib menitipkan tas dan jaket di loker yang telah disediakan sebelum memasuki ruang baca.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">02</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Menjaga ketenangan dan tidak melakukan percakapan suara keras di area belajar mandiri.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">03</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Tidak diperkenankan membawa makanan atau minuman berwarna ke dalam area koleksi buku.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">04</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Merapikan kembali kursi dan membuang sampah pada tempatnya setelah selesai berkunjung.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RESERVASI RUANGAN (Kanan) */}
                            {/* RESERVASI RUANGAN (Kanan) */}
                            <div className="lg:col-span-1">
                                <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-lg h-full flex flex-col">
                                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                        <Monitor className="text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Booking Ruang Diskusi</h3>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Ingin menggunakan ruang diskusi untuk kelompok? Lakukan reservasi jadwal minimal 1 hari sebelumnya.
                                    </p>
                                    <div className="mt-auto space-y-3">
                                        {/* PERUBAHAN DI SINI: Menggunakan Link sebagai pengganti button */}
                                        <Link
                                            href="https://pustaka.thamrin.ac.id/index.php?p=visitor"
                                            className="inline-block w-full text-center py-4 px-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-all"
                                        >
                                            Cek Ketersediaan Ruang
                                        </Link>

                                        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                                            Tersedia untuk Mahasiswa & Dosen
                                        </p>
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