import { Head } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';

export default function Contact() {
    return (
        <>
            <Head title="Kontak - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={undefined} />

                <main className="pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* HERO SECTION */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/5 border border-slate-200/60 backdrop-blur-md p-8 md:p-16 mb-12 shadow-sm text-center">
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                            <div className="relative z-10">
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                                    Hubungi <span className="text-indigo-600">Kami</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                                    Punya pertanyaan mengenai layanan perpustakaan, peminjaman, atau akses jurnal? Tim kami siap membantu Anda.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">

                            {/* LEFT COLUMN: CONTACT INFO */}
                            <div className="space-y-6">
                                <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm h-full">
                                    <h3 className="text-xl font-bold text-slate-900 mb-8">Informasi Kontak</h3>

                                    <div className="space-y-8">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Lokasi Kampus</p>
                                                <p className="text-sm text-slate-500 leading-relaxed">
                                                    Jl. Raya Pondok Gede No. 23, <br />
                                                    Kramat Jati, Jakarta Timur, 13550
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Email Resmi</p>
                                                <p className="text-sm text-slate-500">perpustakaan@thamrin.ac.id</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <MessageCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">WhatsApp Hotlink</p>
                                                <p className="text-sm text-slate-500">+62 812-3456-7890</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Clock size={18} className="text-indigo-600" />
                                            <span className="text-sm font-medium">Respon Cepat: Senin - Jumat</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE & RIGHT COLUMN: CONTACT FORM */}
                            <div className="lg:col-span-2">
                                <div className="rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h3>
                                    <p className="text-slate-500 mb-8">Saran dan masukan Anda sangat berharga bagi pengembangan layanan kami.</p>

                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Nama Lengkap</label>
                                            <input type="text" placeholder="Masukkan nama..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">NIM / NIDN (Opsional)</label>
                                            <input type="text" placeholder="Contoh: 1032210..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Subjek</label>
                                            <select className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none appearance-none">
                                                <option>Informasi Peminjaman</option>
                                                <option>Akses E-Resources</option>
                                                <option>Bebas Pustaka</option>
                                                <option>Saran & Kritik</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Pesan</label>
                                            <textarea rows={4} placeholder="Tuliskan pesan Anda di sini..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none resize-none"></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <button className="flex items-center justify-center gap-2 w-full md:w-fit px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                                                Kirim Sekarang <Send size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* MAPS SECTION */}
                        <section className="mb-20">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                                    <Globe className="text-indigo-600" /> Lokasi Fisik
                                </h2>
                            </div>
                            <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0526743936085!2d106.87847427499066!3d-6.256788993731818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f310f8541315%3A0xc3419385b0021665!2sUniversitas%20MH.%20Thamrin!5e0!3m2!1sid!2sid!4v1709400000000!5m2!1sid!2sid"
                                    className="w-full h-full border-0"
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </section>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}