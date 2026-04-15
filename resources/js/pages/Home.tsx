import { Head } from '@inertiajs/react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import Lite from '@/components/home/Lite';
import Services from '@/components/home/Services';
import Article from '@/components/home/Article';
import Panduan from '@/components/home/Panduan';

import Footer from '@/components/home/Footer';

// Definisi tipe data untuk props agar tidak error
interface WelcomeProps {
    hero: any;
    services: any;
    articles: any;
    partners: any;
}

export default function Welcome({ hero, services, articles, partners }: WelcomeProps) {
    return (
        <>
            <Head title="Home - Perpustakaan UMHT" />

            <div className="min-h-screen flex flex-col bg-white">
                {/* Navbar */}
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

                    {/* Slider Client/Partner */}
                    {/* <Client partners={partners} /> */}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}