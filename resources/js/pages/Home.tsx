import { Head } from '@inertiajs/react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import Lite from '@/components/home/Lite';
import Services from '@/components/home/Services';
import Article from '@/components/home/Article';
import Panduan from '@/components/home/Panduan';
import Footer from '@/components/home/Footer';

interface WelcomeProps {
    hero: any;
    services: any;
    articles: any; 
    partners: any;
    auth: any;
}

export default function Welcome({ hero, services, articles, partners }: WelcomeProps) {
    return (
        <>
            <Head title="Home - Perpustakaan UMHT" />

            <div className="min-h-screen flex flex-col bg-white">
                {/* Navbar */}
                <Navbar auth={null} />

                <main className="flex-1">

                    <Hero hero={hero} />
                    <Lite />
                    <Services services={services} />
                    <Article articles={articles} />
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