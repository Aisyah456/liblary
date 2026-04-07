import { Head } from '@inertiajs/react';
import Footer from '@/Components/home/Footer';
import Hero from '@/Components/home/Hero';
import Services from '@/Components/home/Menu';
import Navbar from '@/Components/home/Navbar';
import Article from '@/Components/home/Article'; // Perbaikan typo 'Articel' -> 'Article'
import Client from '@/Components/home/parts/ClientSlider';
import Panduan from '@/Components/home/Panduan';
import Lite from '@/Components/home/Lite';

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