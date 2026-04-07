import { Head } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import {
    Info,
    Monitor,
    ExternalLink,
    Microscope,
    Stethoscope,
    Database,
    Globe,
    Zap
} from 'lucide-react';

export default function EJournalPage() {
    const journals = [
        {
            name: "ScienceDirect",
            field: "Bidang Kesehatan & Kedokteran",
            desc: "Akses ke ribuan artikel jurnal ilmiah multidisiplin dengan fokus utama pada riset kesehatan dan sains.",
            link: "https://www.sciencedirect.com",
            icon: <Stethoscope className="text-emerald-600" />
        },
        {
            name: "ProQuest",
            field: "Bidang Teknik & Teknologi",
            desc: "Database komprehensif yang menyediakan koleksi jurnal, tesis, dan publikasi teknik dari seluruh dunia.",
            link: "https://www.proquest.com",
            icon: <Database className="text-teal-600" />
        },
        {
            name: "EBSCOhost",
            field: "Bidang Ekonomi & Bisnis",
            desc: "Sumber referensi terpercaya untuk jurnal ekonomi, manajemen, dan literatur bisnis internasional.",
            link: "https://search.ebscohost.com",
            icon: <Globe className="text-cyan-600" />
        },
        {
            name: "SpringerLink",
            field: "Bidang Sosial & Humaniora",
            desc: "Akses ke jutaan dokumen ilmiah dalam bidang ilmu sosial, hukum, dan literatur akademik global.",
            link: "https://link.springer.com",
            icon: <Microscope className="text-emerald-500" />
        }
    ];

    return (
        <>
            <Head title="E-Journal Internasional - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION - UBAH WARNA KE EMERALD/TEAL */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/20 p-8 md:p-16 mb-12 shadow-2xl text-center">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"></div>

                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-400/20">
                                    <Zap size={14} /> Digital Library Resources
                                </span>
                                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                                    Akses <span className="text-emerald-400">E-Journal</span> Internasional
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-emerald-100/80">
                                    Hubungkan riset Anda dengan ribuan referensi global. Database ilmiah terakreditasi yang dilanggan khusus untuk civitas akademika UMHT.
                                </p>
                            </div>
                        </div>

                        {/* E-JOURNAL GRID - TAMPILAN LEBIH BERSIH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {journals.map((journal, index) => (
                                <a
                                    key={index}
                                    href={journal.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            {journal.icon}
                                        </div>
                                        <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <ExternalLink size={16} />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                                        {journal.name}
                                    </h3>
                                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-4">
                                        {journal.field}
                                    </p>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                        {journal.desc}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-emerald-600">
                                        Buka Jurnal
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* INFO & BOOKING SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* TATA TERTIB PENGGUNAAN DIGITAL */}
                            <div className="lg:col-span-2">
                                <section className="rounded-[2.5rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                        <Info className="text-emerald-600" /> Panduan Akses E-Journal
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">01</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Gunakan jaringan WiFi kampus atau VPN UMHT untuk akses otomatis tanpa login (IP Based).</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">02</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Untuk akses dari luar kampus, gunakan akun SSO (Single Sign-On) yang telah diverifikasi perpustakaan.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">03</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Dilarang memperjualbelikan atau mendistribusikan artikel jurnal secara ilegal.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">04</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Hubungi admin IT Support jika mengalami kendala login pada masing-masing platform.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* IT SUPPORT / HELP DESK */}
                            <div className="lg:col-span-1">
                                <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-lg h-full flex flex-col relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 h-40 w-40 bg-emerald-500/10 rounded-full blur-2xl"></div>

                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                                        <Monitor className="text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Bantuan IT & E-Resources</h3>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Kesulitan mengakses jurnal? Tim IT Support kami siap membantu Anda melakukan konfigurasi akun dan perangkat.
                                    </p>
                                    <div className="mt-auto space-y-3">
                                        <button className="w-full py-4 px-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                                            Hubungi Help Desk
                                        </button>
                                        <p className="text-[10px] text-center text-slate-500 uppercase tracking-[0.2em] font-bold">
                                            Senin - Jumat | 08:00 - 16:00
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