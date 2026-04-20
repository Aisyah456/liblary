import { Link } from '@inertiajs/react';
import { 
    Facebook, 
    Twitter, 
    Youtube, 
    Linkedin, 
    MapPin, 
    Phone, 
    Mail, 
    Clock 
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const services = [
        { name: 'Peminjaman Buku', href: 'https://pustaka.thamrin.ac.id/' },
        { name: 'Layanan Referensi', href: '#' },
        { name: 'Layanan Sirkulasi', href: '/layanan/sirkulasi' },
        { name: 'Bebas Pustaka', href: '/layanan/bebas-pustaka' },
        { name: 'Uji Turnitin', href: '/layanan/cek-turnitin' },
    ];

    const socials = [
        { icon: <Facebook size={18} />, name: 'Facebook', href: '#' },
        { icon: <Twitter size={18} />, name: 'Twitter', href: '#' },
        { icon: <Youtube size={18} />, name: 'Youtube', href: '#' },
        { icon: <Linkedin size={18} />, name: 'Linkedin', href: '#' },
    ];

    return (
        <footer className="bg-[#0b1b35] pt-16 pb-8 text-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    
                    {/* Kolom 1: Profil & Socials */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-lg">
                            <img
                                src="/images/logo-umht.png"
                                alt="Logo UMHT"
                                className="h-12 w-auto object-contain"
                            />  
                        </div>
                        <div>
                            <h3 className="mb-4 border-l-4 border-[#ffcb3e] pl-3 text-sm font-extrabold tracking-widest uppercase">
                                Tentang Kami
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-300">
                                Perpustakaan Universitas Mohammad Husni Thamrin 
                                berkomitmen menjadi pusat sumber belajar digital dan cetak 
                                yang modern untuk mendukung riset berkualitas.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-[#ffcb3e] hover:text-[#0b1b35] hover:-translate-y-1"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Kolom 2: Layanan Cepat */}
                    <div>
                        <h3 className="mb-8 inline-block border-b-2 border-[#ffcb3e] pb-2 text-sm font-extrabold tracking-widest uppercase">
                            Layanan Utama
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link
                                        href={service.href}
                                        className="text-gray-300 transition-colors hover:text-[#ffcb3e] flex items-center group"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffcb3e] mr-3 opacity-50 group-hover:opacity-100 transition-opacity"></span>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Kontak & Jam Operasional */}
                    <div>
                        <h3 className="mb-8 inline-block border-b-2 border-[#ffcb3e] pb-2 text-sm font-extrabold tracking-widest uppercase">
                            Hubungi Kami
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-3 text-[#ffcb3e] shrink-0" />
                                <span>Jl. Raya Pondok Gede No. 23, Jakarta Timur</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-3 text-[#ffcb3e] shrink-0" />
                                <span>(021) 800-6229</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-3 text-[#ffcb3e] shrink-0" />
                                <span>library@thamrin.ac.id</span>
                            </li>
                            <li className="flex items-start pt-2">
                                <Clock size={18} className="mr-3 text-[#ffcb3e] shrink-0" />
                                <div>
                                    <p className="font-bold text-white mb-1">Jam Operasional:</p>
                                    <p>Senin - Jumat: 08:00 - 17:00</p>
                                    <p>Sabtu: 08:00 - 12:00</p>
                                </div>
                            </li>
                        </ul>
                    </div>
{/* Kolom 4: Lokasi / Maps Widget */}
<div>
    <h3 className="mb-8 inline-block border-b-2 border-[#ffcb3e] pb-2 text-sm font-extrabold tracking-widest uppercase">
        Lokasi Kampus
    </h3>
    <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg group transition-all duration-500">
        <div className="relative h-40 w-full grayscale-[0.6] hover:grayscale-0 transition-all duration-700">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8174567389406!2d106.87220237380343!3d-6.287709293701238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f298bb8709a9%3A0x65e3a53691bd58a0!2sUniversitas%20MH%20Thamrin!5e0!3m2!1sid!2sid!4v1774840346729!5m2!1sid!2sid"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Universitas MH Thamrin"
            ></iframe>
            
            {/* Overlay opsional jika ingin memberikan efek klik ke Maps asli */}
            <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-black/10 transition-colors"></div>
        </div>
        
        {/* Tombol bantuan kecil di bawah map */}
        <a 
            href="https://maps.app.goo.gl/YourGoogleMapsShortLink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-white/5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-[#ffcb3e] hover:text-[#0b1b35] transition-colors"
        >
            <MapPin size={12} className="mr-1" />
            Petunjuk Arah
        </a>
    </div>
</div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8 mt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-center text-sm tracking-wide text-gray-400 md:text-left">
                            &copy; {currentYear} <span className="text-white font-semibold">Perpustakaan UMHT</span>. All rights reserved.
                        </p>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-400">Developed by</span>
                            <span className="ml-1.5 font-bold text-[#ffcb3e] hover:brightness-110 cursor-default">
                                PUSTIKOM UMHT
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}