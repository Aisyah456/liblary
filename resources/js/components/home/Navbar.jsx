import React, { useState, useEffect, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sesuai dengan Route::prefix('layanan') di web.php
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
        if (item.external) {
            return (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {item.name}
                </a>
            );
        }
        return <Link href={item.href} className={className}>{item.name}</Link>;
    };

    return (
        <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
            <div className="mx-auto max-w-7xl px-4">
                <div className={`flex items-center justify-between px-6 py-2.5 rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ${
                    isScrolled ? 'backdrop-blur-md bg-white/90' : 'bg-white'
                }`}>
                    
                    {/* LEFT: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <img src="/images/logo-umht.png" alt="Logo" className="h-9 w-auto" />
                        </Link>
                    </div>

                    {/* MIDDLE: Desktop Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Beranda</Link>
                        <Link href="/profil" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Profil</Link>
                        
                        <DesktopDropdown title="Layanan" items={layananItems} NavLink={NavLink} />
                        <DesktopDropdown title="Koleksi" items={koleksiItems} NavLink={NavLink} />
                        
                        <Link href="/news" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Berita</Link>
                        <Link href="/layanan/kontak" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Kontak</Link>
                    </div>

                    {/* RIGHT: Login & Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        {!auth?.user ? (
                            <Link 
                                href="/login"
                                className="hidden md:inline-flex items-center bg-zinc-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all text-sm font-semibold shadow-sm active:scale-95"
                            >
                                Login
                            </Link>
                        ) : (
                            <Link href="/dashboard" className="hidden md:inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm">
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
                                            <MobileLink href="/">Beranda</MobileLink>
                                            <MobileLink href="/profil">Profil</MobileLink>
                                            
                                            <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Layanan</div>
                                            {layananItems.map((item) => (
                                                <MobileLink key={item.name} href={item.href}>{item.name}</MobileLink>
                                            ))}

                                            <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Koleksi</div>
                                            {koleksiItems.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    as={item.external ? 'a' : Link}
                                                    href={item.href}
                                                    {...(item.external ? { target: "_blank" } : {})}
                                                    className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>
                                            ))}

                                            <div className="my-2 border-t border-gray-100" />
                                            <MobileLink href="/news">Berita & Pengumuman</MobileLink>
                                            <MobileLink href="/layanan/kontak">Kontak</MobileLink>
                                            
                                            {!auth?.user ? (
                                                <Link href="/login" className="flex justify-center items-center bg-zinc-900 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg">
                                                    Login Anggota
                                                </Link>
                                            ) : (
                                                <Link href="/dashboard" className="flex justify-center items-center bg-indigo-600 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg">
                                                    Ke Dashboard
                                                </Link>
                                            )}
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

function DesktopDropdown({ title, items, NavLink }) {
    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 outline-none group transition-colors">
                {title}
                <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
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
                <Menu.Items className="absolute left-0 mt-2 w-52 origin-top-left bg-white border border-gray-100 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] py-2 overflow-hidden">
                    {items.map((item) => (
                        <Menu.Item key={item.name}>
                            {({ active }) => (
                                <NavLink 
                                    item={item}
                                    className={`${
                                        active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
                                    } block px-5 py-3 text-sm font-medium transition-colors`}
                                />
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

function MobileLink({ href, children }) {
    return (
        <Disclosure.Button
            as={Link}
            href={href}
            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
        >
            {children}
        </Disclosure.Button>
    );
}