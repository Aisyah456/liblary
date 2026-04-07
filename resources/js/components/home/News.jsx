import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

// --- Dummy Data ---
const dummyNews = [
    {
        id: 1,
        title: "Peresmian Ruang Literasi Digital Baru",
        excerpt: "Nikmati fasilitas komputer high-end dan akses jurnal internasional lebih cepat di lantai 2.",
        thumbnail: null,
        slug: "peresmian-ruang-literasi",
        created_at: "2024-03-10"
    },
    {
        id: 2,
        title: "Workshop Menulis Artikel Ilmiah 2024",
        excerpt: "Daftarkan diri Anda dalam pelatihan penulisan jurnal terakreditasi bersama narasumber ahli.",
        thumbnail: null,
        slug: "workshop-menulis-2024",
        created_at: "2024-03-08"
    },
    {
        id: 3,
        title: "Penambahan Koleksi Buku Referensi Medis",
        excerpt: "Telah tersedia 50+ judul buku terbaru kedokteran dan kesehatan masyarakat bulan ini.",
        thumbnail: null,
        slug: "koleksi-buku-medis",
        created_at: "2024-03-05"
    },
    {
        id: 4,
        title: "Jam Operasional Selama Bulan Ramadhan",
        excerpt: "Informasi perubahan jadwal layanan sirkulasi dan ruang baca selama bulan suci.",
        thumbnail: null,
        slug: "jam-operasional-ramadhan",
        created_at: "2024-03-01"
    },
    {
        id: 5,
        title: "Lomba Desain Bookmark Perpustakaan",
        excerpt: "Tunjukkan kreativitasmu dan menangkan hadiah menarik serta bookmark karyamu akan dicetak.",
        thumbnail: null,
        slug: "lomba-desain-bookmark",
        created_at: "2024-02-28"
    }
];

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // Simulasi delay API
                setTimeout(() => {
                    setProjects(dummyNews);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <Wrapper id="projects">
            <div className="container">
                <HeaderSection>
                    <Badge>
                        <Newspaper size={14} />
                        Update Terbaru
                    </Badge>
                    <h1 className="title">Warta Perpustakaan</h1>
                    <p className="subtitle">
                        Eksplorasi kegiatan, inovasi layanan, dan pengumuman terbaru untuk mendukung perjalanan akademik Anda.
                    </p>
                </HeaderSection>

                <GridContainer>
                    {loading ? (
                        [1, 2, 3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        projects.map((item) => (
                            <NewsCard key={item.id}>
                                <div className="img-container">
                                    <img 
                                        src={item.thumbnail ? `/storage/${item.thumbnail}` : `https://picsum.photos/seed/${item.id}/600/400`} 
                                        alt={item.title} 
                                    />
                                    <div className="date-tag">
                                        <Calendar size={12} />
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div className="content">
                                    <h3>{item.title}</h3>
                                    <p>{item.excerpt}</p>
                                    <button onClick={() => window.location.href = `/news/${item.slug}`}>
                                        Baca Selengkapnya <ArrowRight size={16} />
                                    </button>
                                </div>
                            </NewsCard>
                        ))
                    )}
                </GridContainer>

                <FooterAction>
                    <MainButton onClick={() => window.location.href = '/news'}>
                        Lihat Semua Berita
                    </MainButton>
                </FooterAction>
            </div>
        </Wrapper>
    );
}

// --- Styled Components (Modern UI/UX) ---

const Wrapper = styled.section`
    padding: 80px 0;
    background-color: #fcfcfd;
    min-height: 100vh;
`;

const HeaderSection = styled.div`
    text-align: center;
    margin-bottom: 60px;
    
    .title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #0f172a;
        margin: 15px 0;
        letter-spacing: -1px;
    }
    .subtitle {
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }
`;

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #2563eb;
    padding: 6px 16px;
    border-radius: 99px;
    font-size: 0.85rem;
    font-weight: 600;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 30px;
    padding: 10px;
`;

const NewsCard = styled.div`
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        border-color: #2563eb;
    }

    .img-container {
        position: relative;
        height: 200px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-cover: cover;
            transition: transform 0.5s ease;
        }
    }

    &:hover img {
        transform: scale(1.1);
    }

    .date-tag {
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #1e293b;
    }

    .content {
        padding: 24px;
        h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }
        p {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        button {
            background: transparent;
            border: none;
            color: #2563eb;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 0;
            transition: gap 0.2s ease;
            
            &:hover {
                gap: 12px;
            }
        }
    }
`;

const FooterAction = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 60px;
`;

const MainButton = styled.button`
    background: #0f172a;
    color: white;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #1e293b;
        transform: scale(1.05);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

const SkeletonCard = styled.div`
    height: 380px;
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-repeat: no-repeat;
    background-size: 800px 380px;
    display: inline-block;
    position: relative;
    animation: ${shimmer} 1s linear infinite forwards;
    border-radius: 20px;
`;