import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';


import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ChevronDown, CheckCircle2 } from 'lucide-react';
import { route } from 'ziggy-js';

export default function Contact() {
    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        nama_lengkap: '',
        nim_nidn: '',
        email: '',
        subjek: 'Informasi Peminjaman',
        pesan: '',
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        post(route('messages.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.log(errors); // Cek error validasi di console
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Kontak - Perpustakaan UMHT" />

            <div className="min-h-screen bg-slate-50/50">
                <Navbar auth={{ user: null }} />

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
                                                <p className="text-sm text-slate-500 leading-relaxed text-balance">
                                                    Jl. Raya Pondok Gede No. 23, Kramat Jati, Jakarta Timur, 13550
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
                                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 md:p-10 shadow-sm transition-all hover:shadow-md min-h-[500px]">

                                    {/* NOTIFIKASI SUKSES (Overlay) */}
                                    {recentlySuccessful && (
                                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                                            <div className="mb-4 bg-green-100 p-4 rounded-full">
                                                <CheckCircle2 size={48} className="text-green-600" />
                                            </div>
                                            <h4 className="text-2xl font-bold text-slate-900 text-center">Pesan Berhasil Terkirim!</h4>
                                            <p className="text-slate-500 mt-2 text-center max-w-xs">
                                                Terima kasih. Pesan Anda telah kami terima dan akan segera kami proses.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => reset()} // Cukup reset untuk menghilangkan overlay jika diperlukan
                                                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                                            >
                                                Kirim Pesan Lain
                                            </button>
                                        </div>
                                    )}

                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h3>
                                    <p className="text-slate-500 mb-8 text-balance">Saran dan masukan Anda sangat berharga bagi pengembangan layanan kami.</p>

                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.nama_lengkap}
                                                onChange={e => setData('nama_lengkap', e.target.value)}
                                                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none ${errors.nama_lengkap ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'}`}
                                                placeholder="Masukkan nama..."
                                            />
                                            {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nama_lengkap}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">NIM / NIDN (Opsional)</label>
                                            <input
                                                type="text"
                                                value={data.nim_nidn}
                                                onChange={e => setData('nim_nidn', e.target.value)}
                                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                                placeholder="Contoh: 1032210..."
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Alamat Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'}`}
                                                placeholder="contoh@email.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Subjek</label>
                                            <div className="relative group">
                                                <select
                                                    value={data.subjek}
                                                    onChange={e => setData('subjek', e.target.value)}
                                                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="Informasi Peminjaman">Informasi Peminjaman</option>
                                                    <option value="Akses E-Resources">Akses E-Resources</option>
                                                    <option value="Bebas Pustaka">Bebas Pustaka</option>
                                                    <option value="Saran & Kritik">Saran & Kritik</option>
                                                </select>
                                                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Pesan</label>
                                            <textarea
                                                rows={4}
                                                required
                                                value={data.pesan}
                                                onChange={e => setData('pesan', e.target.value)}
                                                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none resize-none ${errors.pesan ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'}`}
                                                placeholder="Tuliskan pesan Anda di sini..."
                                            ></textarea>
                                            {errors.pesan && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pesan}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex items-center justify-center gap-2 w-full md:w-fit px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                                            >
                                                {processing ? (
                                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>Kirim Sekarang <Send size={18} /></>
                                                )}
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
                            <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl bg-slate-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.014382898952!2d106.87440437503803!3d-6.261841793726749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f2ea305e7163%3A0x6a25697d448373b!2sUniversitas%20M%20H%20Thamrin!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
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