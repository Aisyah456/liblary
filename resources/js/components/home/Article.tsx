// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Calendar, ArrowRight, Newspaper, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

// 1. Definisi Interface untuk Data Berita
interface Article {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    category: string;
    excerpt: string;
    reading_time: number | string;
    is_featured: boolean;
    created_at: string;
}

interface ArticleProps {
    articles: {
        data?: Article[]; // Jika dari pagination Laravel
    } | Article[]; // Jika array biasa
}

// 2. Helper Functions (Ditaruh luar agar lebih bersih)
const getThumb = (path: string | null) => {
    if (!path) return '/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

export default function Articel({ articles }: ArticleProps) {
    // Penanganan data yang lebih robust
    const rawData: Article[] = Array.isArray(articles)
        ? articles
        : articles?.data || [];

    const featured = rawData.find(a => a.is_featured) || rawData[0];
    const sideNews = rawData
        .filter(a => a.id !== featured?.id)
        .slice(0, 4);

    if (rawData.length === 0) {
        return (
            <Wrapper>
                <div className="container">
                    <EmptyState>
                        <Newspaper size={48} />
                        <p>Belum ada berita atau event tersedia saat ini.</p>
                    </EmptyState>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="container">
                <TopHeader>
                    <div>
                        <Badge><Newspaper size={14} /> Berita & Event</Badge>
                        <h1>Warta Literasi</h1>
                    </div>
                    <p>Ikuti perkembangan terbaru dari ekosistem perpustakaan kami.</p>
                </TopHeader>

                <ContentLayout>  
                    {/* FEATURED NEWS */}
                    {featured && (
                        <FeaturedCard>
                            <Link href={`/articles/${featured.slug}`}>
                                <div className="img-wrapper">
                                    <img
                                        src={getThumb(featured.thumbnail)}
                                        alt={featured.title}
                                    />
                                    <span className="cat-tag">{featured.category}</span>
                                </div>
                                <div className="info">
                                    <div className="meta">
                                        <span><Calendar size={14} /> {formatDate(featured.created_at)}</span>
                                        <span><Clock size={14} /> {featured.reading_time} mnt baca</span>
                                    </div>
                                    <h2>{featured.title}</h2>
                                    <p>{featured.excerpt}</p>
                                    <div className="action">
                                        Baca Artikel <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        </FeaturedCard>
                    )}

                    {/* SIDE NEWS */}
                    <SideList>
                        <h3 className="section-label">Berita Lainnya</h3>
                        {sideNews.map((item) => (
                            <SideCard key={item.id}>
                                <Link href={`/articles/${item.slug}`} className="side-link">
                                    <img
                                        src={getThumb(item.thumbnail)}
                                        alt={item.title}
                                    />
                                    <div className="side-info">
                                        <span className="side-cat">{item.category}</span>
                                        <h4>{item.title}</h4>
                                        <span className="side-date">{formatDate(item.created_at)}</span>
                                    </div>
                                </Link>
                            </SideCard>
                        ))}

                        <Link href="/news" style={{ textDecoration: 'none' }}>
                            <ViewAllBtn $active={false}>
                                Lihat Semua Arsip Berita
                            </ViewAllBtn>
                        </Link>
                    </SideList>
                </ContentLayout>
            </div>
        </Wrapper>
    );
}

// --- Styled Components Tetap Sama (Sangat Bagus) ---
const Wrapper = styled.section`
    padding: 80px 0; /* Tambah sedikit padding */
    background: #f8fafc;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
`;

// ... sisipkan Styled Components lainnya dari kode kamu ...

const TopHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
    h1 {
        font-size: 2.5rem;
        font-weight: 900;
        color: #0f172a;
        margin: 8px 0 0 0;
    }
    p {
        color: #64748b;
        max-width: 300px;
        font-size: 0.95rem;
        text-align: right;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        p { text-align: left; margin-top: 15px; }
    }
`;

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2563eb;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
`;

const ContentLayout = styled.div`
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 40px;
    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

const FeaturedCard = styled.div`
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    a { text-decoration: none; color: inherit; display: block; }
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 30px 40px -10px rgba(0,0,0,0.1);
        img { transform: scale(1.05); }
    }
    .img-wrapper {
        position: relative;
        height: 400px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.6s ease;
        }
        .cat-tag {
            position: absolute;
            top: 20px;
            left: 20px;
            background: #2563eb;
            color: white;
            padding: 6px 15px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.8rem;
            z-index: 10;
        }
    }
    .info {
        padding: 30px;
        .meta {
            display: flex;
            gap: 20px;
            color: #94a3b8;
            font-size: 0.85rem;
            margin-bottom: 15px;
            span { display: flex; align-items: center; gap: 5px; }
        }
        h2 {
            font-size: 1.8rem;
            color: #0f172a;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        p {
            color: #475569;
            line-height: 1.7;
            margin-bottom: 25px;
        }
        .action {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #2563eb;
            font-weight: 800;
        }
    }
`;

const SideList = styled.div`
    .section-label {
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 20px;
        padding-left: 10px;
        border-left: 4px solid #2563eb;
    }
`;

const SideCard = styled.div`
    margin-bottom: 15px;
    .side-link {
        display: flex;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 16px;
        text-decoration: none;
        color: inherit;
        transition: 0.2s;
        &:hover {
            background: #f1f5f9;
            h4 { color: #2563eb; }
        }
    }
    img {
        width: 100px;
        height: 100px;
        border-radius: 12px;
        object-fit: cover;
    }
    .side-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .side-cat {
            font-size: 0.7rem;
            font-weight: 700;
            color: #2563eb;
            text-transform: uppercase;
        }
        h4 {
            font-size: 0.95rem;
            margin: 5px 0;
            color: #1e293b;
            line-height: 1.4;
        }
        .side-date {
            font-size: 0.8rem;
            color: #94a3b8;
        }
    }
`;

// Ganti active menjadi $active
const ViewAllBtn = styled.div<{ $active?: boolean }>`
    width: 100%;
    text-align: center;
    margin-top: 10px;
    padding: 15px;
    /* Gunakan $active di sini */
    background: ${props => props.$active ? 'transparent' : '#f1f5f9'};
    border: 2px dashed #cbd5e1;
    color: #64748b;
    border-radius: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        border-color: #2563eb;
        color: #2563eb;
        background: #eff6ff;
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
    color: #94a3b8;
    gap: 15px;
    p { font-size: 1.1rem; }
`;