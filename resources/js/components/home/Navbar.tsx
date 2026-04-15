import React, { useState, useEffect, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import { ChevronDown, Menu as MenuIcon, X, ExternalLink } from 'lucide-react';

export default function Navbar({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage(); // Untuk mendeteksi link aktif

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const layananItems = [
        { name: 'Sirkulasi', href: '/layanan/sirkulasi' },
        { name: 'Ruang Baca', href: '/layanan/ruang-baca' },
        { name: 'Bebas Pustaka', href: '/layanan/bebas-pustaka' },
        { name: 'Turnitin', href: '/layanan/cek-turnitin' },
    ];

    const koleksiItems = [
        { name: 'E-Journal', href: '/layanan/e-journal', external: false },
        { name: 'E-Resources', href: 'http://eresources.thamrin.ac.id/', external: true },
        { name: 'Slims (OPAC)', href: 'https://pustaka.thamrin.ac.id/', external: true },
    ];

    const NavLink = ({ item, className }) => {
        const isActive = url === item.href;
        if (item.external) {
            return (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${className} flex items-center justify-between`}>
                    {item.name}
                    <ExternalLink size={12} className="opacity-50" />
                </a>
            );
        }
        return (
            <Link href={item.href} className={`${className} ${isActive ? 'bg-emerald-50 text-emerald-700' : ''}`}>
                {item.name}
            </Link>
        );
    };

    return (
        <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
            <div className="mx-auto max-w-7xl px-4">
                <div className={`flex items-center justify-between px-6 py-2 rounded-2xl border border-gray-200/80 shadow-sm transition-all duration-300 ${
                    isScrolled ? 'backdrop-blur-md bg-white/90 shadow-lg' : 'bg-white'
                }`}>
                    
                    {/* LEFT: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            <img src="/images/logo-umht.png" alt="Logo" className="h-9 w-auto transition-transform group-hover:scale-105" />
                        </Link>
                    </div>

                    {/* MIDDLE: Desktop Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <DesktopLink href="/" active={url === '/'}>Beranda</DesktopLink>
                        <DesktopLink href="/profil" active={url.startsWith('/profil')}>Profil</DesktopLink>
                        
                        <DesktopDropdown title="Layanan" items={layananItems} NavLink={NavLink} active={url.startsWith('/layanan') && !url.includes('e-journal')} />
                        <DesktopDropdown title="Koleksi" items={koleksiItems} NavLink={NavLink} active={url.includes('e-journal') || url.includes('eresources')} />
                        
                        <DesktopLink href="/news" active={url.startsWith('/news')}>Berita</DesktopLink>
                        <DesktopLink href="/layanan/kontak" active={url === '/layanan/kontak'}>Kontak</DesktopLink>
                    </div>

                    {/* RIGHT: Login & Mobile Toggle */}
                    <div className="flex items-center space-x-3">
                        {!auth?.user ? (
                            <Link 
                                href="/login"
                                className="hidden md:inline-flex items-center bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold shadow-sm active:scale-95"
                            >
                                Login
                            </Link>
                        ) : (
                            <Link href="/dashboard" className="hidden md:inline-flex items-center bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold shadow-sm">
                                Panel Admin
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <Disclosure as="div" className="md:hidden">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none">
                                        {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                                    </Disclosure.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition duration-200 ease-out"
                                        enterFrom="opacity-0 translate-y-2"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition duration-150 ease-in"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-2"
                                    >
                                        <Disclosure.Panel className="absolute inset-x-4 top-20 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex flex-col space-y-1 z-[110] max-h-[85vh] overflow-y-auto">
                                            <MobileLink href="/" active={url === '/'}>Beranda</MobileLink>
                                            <MobileLink href="/profil" active={url.startsWith('/profil')}>Profil</MobileLink>
                                            
                                            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Layanan Utama</div>
                                            {layananItems.map((item) => (
                                                <MobileLink key={item.name} href={item.href} active={url === item.href}>{item.name}</MobileLink>
                                            ))}

                                            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Koleksi Digital</div>
                                            {koleksiItems.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    as={item.external ? 'a' : Link}
                                                    href={item.href}
                                                    {...(item.external ? { target: "_blank" } : {})}
                                                    className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                                        url === item.href ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {item.name}
                                                        {item.external && <ExternalLink size={14} className="opacity-40" />}
                                                    </div>
                                                </Disclosure.Button>
                                            ))}

                                            <div className="my-2 border-t border-gray-100" />
                                            <MobileLink href="/news" active={url.startsWith('/news')}>Berita & Pengumuman</MobileLink>
                                            <MobileLink href="/layanan/kontak" active={url === '/layanan/kontak'}>Kontak</MobileLink>
                                            
                                            <div className="pt-4">
                                                {!auth?.user ? (
                                                    <Link href="/login" className="flex justify-center items-center bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-200">
                                                        Login Anggota
                                                    </Link>
                                                ) : (
                                                    <Link href="/dashboard" className="flex justify-center items-center bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100">
                                                        Ke Dashboard
                                                    </Link>
                                                )}
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function DesktopLink({ href, children, active }) {
    return (
        <Link 
            href={href} 
            className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                active ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
            }`}
        >
            {children}
        </Link>
    );
}

function DesktopDropdown({ title, items, NavLink, active }) {
    return (
        <Menu as="div" className="relative">
            <Menu.Button className={`flex items-center px-4 py-2 text-sm font-semibold outline-none group transition-all rounded-lg ${
                active ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
            }`}>
                {title}
                <ChevronDown className="ml-1.5 w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 translate-y-1"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 translate-y-1"
            >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white border border-gray-100 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] p-2 overflow-hidden">
                    {items.map((item) => (
                        <Menu.Item key={item.name}>
                            {({ active: itemActive }) => (
                                <NavLink 
                                    item={item}
                                    className={`${
                                        itemActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'
                                    } block px-4 py-3 text-sm font-medium rounded-xl transition-colors`}
                                />
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

function MobileLink({ href, children, active }) {
    return (
        <Disclosure.Button
            as={Link}
            href={href}
            className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                active ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-slate-50'
            }`}
        >
            {children}
        </Disclosure.Button>
    );
}