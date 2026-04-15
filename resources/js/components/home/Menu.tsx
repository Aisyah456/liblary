import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
    BookOpen, Cpu, Users, Archive, 
    Zap, Anchor, Bot, ClipboardList, 
    Wrench, Layers, Sparkles, HelpCircle
} from 'lucide-react';

const iconMap = {
    book: <BookOpen size={32} color="#0ea5e9" />,
    cpu: <Cpu size={32} color="#0ea5e9" />,
    users: <Users size={32} color="#f97316" />,
    archive: <Archive size={32} color="#eab308" />,
    workflow: <Zap size={32} color="#f97316" />,
    tool: <Wrench size={32} color="#64748b" />,
    learning: <Layers size={32} color="#10b981" />,
    bot: <Bot size={32} color="#0ea5e9" />,
    list: <ClipboardList size={32} color="#0ea5e9" />,
};

export default function Services({ services }:any) {
    
    const displayServices = services && services.length > 0 ? services : [
        { id: 1, title: "E-Resources", description: "Akses koleksi tugas akhir digital.", icon: "book" },
        { id: 2, title: "Peminjaman Buku", description: "Layanan peminjaman buku untuk mahasiswa.", icon: "list" }
    ];

    return (
        <Wrapper id="services">
            <div className="bg-blob shadow-1"></div>
            <div className="bg-blob shadow-2"></div>

            <div className="container">
                <HeaderInfo>
                    <div className="badge">
                        <Sparkles size={16} />
                        <span>Platform Ecosystem</span>
                    </div>
                    <h1>Layanan Literasi Masa Depan</h1>
                    <p>Integrasi teknologi cerdas untuk ekosistem perpustakaan modern.</p>
                </HeaderInfo>

                <ServiceGrid>
                    {displayServices.map((service: { id: React.Key | null | undefined; link: string; icon: string | number; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; subtitle: any; description: any; }) => (
                        <ServiceCard 
                            key={service.id} 
                            onClick={() => window.location.href = service.link || '#'}
                        >
                            <div className="card-header">
                                <div className="icon-wrapper">
                                    {iconMap[service.icon] || <HelpCircle size={32} color="#0ea5e9" />}
                                </div>
                                {/* Angka 3 (stats-number) sudah dihapus dari sini */}
                                <h3>{service.title}</h3>
                            </div>
                            <div className="card-body">
                                <p>{service.subtitle || service.description}</p>
                            </div>
                        </ServiceCard>
                    ))}
                </ServiceGrid>
            </div>
        </Wrapper>
    );
}

/* ================= STYLES ================= */

const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.section`
    width: 100%;
    padding: 100px 0;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    color: #1e293b;

    .bg-blob {
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        filter: blur(100px);
        z-index: 0;
        opacity: 0.1;
    }
    .shadow-1 { top: -100px; left: -100px; background: #0ea5e9; }
    .shadow-2 { bottom: -100px; right: -100px; background: #94e2ff; }

    .container { 
        max-width: 1100px; 
        margin: 0 auto; 
        padding: 0 25px; 
        position: relative; 
        z-index: 10;
    }
`;

const HeaderInfo = styled.div`
    text-align: center;
    margin-bottom: 60px;
    animation: ${fadeInUp} 0.8s ease-out;

    .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        background: #f0f9ff;
        color: #0ea5e9;
        border-radius: 99px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 16px;
        border: 1px solid #bae6fd;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: #0f172a;
    }

    p { color: #64748b; font-size: 1.1rem; }
`;

const ServiceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
`;

const ServiceCard = styled.div`
    background: #ffffff; 
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    position: relative;
    animation: ${fadeInUp} 0.6s ease-out backwards;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    &:hover {
        background: #f8fafc;
        border-color: #0ea5e9;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(14, 165, 233, 0.1);
    }

    /* GARIS BIRU DIHAPUS: Selektor &:first-child yang lama telah dibuang */

    .card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
    }

    .icon-wrapper { flex-shrink: 0; }

    h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
    }

    .card-body p {
        color: #475569;
        font-size: 0.95rem;
        line-height: 1.5;
        margin: 0;
        padding-left: 48px; /* Agar teks lurus dengan judul, tidak di bawah ikon */
    }
`;