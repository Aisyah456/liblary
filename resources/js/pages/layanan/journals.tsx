import { Head } from '@inertiajs/react';
import Footer from '@/Components/home/Footer';
import Navbar from '@/Components/home/Navbar';
import {
    Info,
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
            name: "Gale OneFile: Nursing and Allied Health",
            field: "Bidang Kesehatan & Kedokteran",
            desc: "Akses ke ribuan artikel jurnal ilmiah multidisiplin dengan fokus utama pada riset kesehatan dan sains.",
            link: "https://link.gale.com/apps/PPNU?u=fjkthlt",
            icon: <Stethoscope className="text-emerald-600" />
        },
        {
            name: "Gale OneFile: Science",
            field: "Bidang Teknik & Teknologi",
            desc: "Database komprehensif yang menyediakan koleksi jurnal, tesis, dan publikasi teknik dari seluruh dunia.",
            link: "https://link.gale.com/apps/PPGS?u=fjktsci",
            icon: <Database className="text-teal-600" />
        },
        {
            name: "Gale OneFile: Entrepreneurship",
            field: "Bidang Ekonomi & Bisnis",
            desc: "Sumber referensi terpercaya untuk jurnal ekonomi, manajemen, dan literatur bisnis internasional.",
            link: "https://link.gale.com/apps/PPSB?u=fjktbus",
            icon: <Globe className="text-cyan-600" />
        },
        {
            name: "Gale Products",
            field: "Bidang Sosial & Humaniora",
            desc: "Akses ke jutaan dokumen ilmiah dalam bidang ilmu sosial, hukum, dan literatur akademik global.",
            link: "https://link.gale.com/apps/SPJ.SO00?u=jkthum",
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

                        {/* HERO SECTION */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/20 p-8 md:p-16 mb-12 shadow-2xl text-center">
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

                        {/* E-JOURNAL GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {journals.map((journal, index) => (
                                <a
                                    key={index}
                                    href={journal.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                {journal.icon}
                                            </div>
                                            <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <ExternalLink size={16} />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors leading-snug">
                                            {journal.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-4">
                                            {journal.field}
                                        </p>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                            {journal.desc}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-sm font-bold text-emerald-600">
                                        Buka Jurnal
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* PANDUAN AKSES SECTION - Full Width */}
                        <div className="w-full">
                            <section className="rounded-[2.5rem] bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
                                <h2 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                                    <Info className="text-emerald-600" /> Panduan Akses E-Journal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">01</div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">Akses Jaringan</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">Gunakan WiFi kampus atau VPN UMHT untuk akses otomatis (IP Based).</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">02</div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">Akses SSO</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">Gunakan akun Single Sign-On (SSO) untuk akses mandiri dari luar kampus.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">03</div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">Etika Penggunaan</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">Dilarang mendistribusikan artikel jurnal secara ilegal atau komersial.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">04</div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">Kendala Login</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">Pastikan akun telah diverifikasi oleh perpustakaan jika terjadi masalah login.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}