import { Head } from '@inertiajs/react';
import Footer from '@/components/home/Footer';

import Article from '@/components/home/Article'; // Perbaikan typo 'Articel' -> 'Article'

import Hero from '@/components/home/Hero';
import Navbar from '@/components/home/Navbar';
import Lite from '@/components/home/Lite';
import Services from './admin/cms/Services';
import Panduan from '@/components/home/Panduan';
import Client from './admin/cms/Client';

// Definisi Interface agar lebih aman (TypeScript)
interface WelcomeProps {
    hero: any;
    services: any[];
    articles: any[];
    partners: any[];
}

export default function Welcome({ hero, services, articles, partners }: WelcomeProps) {
    return (
        <>
            <Head title="Home - Perpustakaan UMHT" />
            <div className="min-h-screen flex flex-col bg-white">
                {/* Navbar biasanya butuh pengecekan auth, jika tidak ada kirim null */}
                <Navbar auth={null} />

                <main className="flex-1">
                    {/* Hero Section */}
                    <Hero hero={hero} />

                    {/* Fitur Utama / Lite */}
                    <Lite />

                    {/* Services/Menu */}
                    <Services services={services} />

                    {/* Berita/Artikel */}
                    <Article articles={articles} />

                    {/* Panduan Penggunaan */}
                    <Panduan />

                    {/* Slider Client/Partner - Pastikan props diteruskan di sini */}
                    <Client partners={partners} />
                </main>

                <Footer />
            </div>
        </>
    );
}