import React from 'react';
import styled from 'styled-components';
import { 
  BookOpen, Users, Globe, Award, 
  ChevronRight, Library 
} from 'lucide-react';

const stats = [
  {
    id: 1,
    title: "Koleksi Buku",
    count: "50.000+",
    desc: "Buku fisik dan digital yang mencakup berbagai disiplin ilmu kesehatan dan umum.",
    icon: <BookOpen size={24} />,
    color: "#0ea5e9"
  },
  {
    id: 2,
    title: "E-Resources",
    count: "12",
    desc: "Database jurnal internasional (ProQuest, ScienceDirect) yang dapat diakses 24/7.",
    icon: <Globe size={24} />,
    color: "#6366f1"
  },
  {
    id: 3,
    title: "Anggota Aktif",
    count: "3.500+",
    desc: "Melayani mahasiswa, dosen, dan staf Universitas MH Thamrin setiap hari.",
    icon: <Users size={24} />,
    color: "#10b981"
  },
  {
    id: 4,
    title: "Akreditasi",
    count: "Unggul",
    desc: "Sertifikasi kualitas layanan perpustakaan standar nasional perpustakaan (SNP).",
    icon: <Award size={24} />,
    color: "#f59e0b"
  }
];

export default function LibraryShortStory() {
  return (
    <SectionWrapper>
      <div className="container">
        <ContentGrid>
          {/* Bagian Kiri: Narasi Singkat (Terinspirasi Gambar 2) */}
          <BrandStory>
            <div className="badge">
              <Library size={14} /> Tentang Kami
            </div>
            <h2>Jendela Ilmu di Jantung <br /><span>Universitas MH Thamrin</span></h2>
            <p>
              Perpustakaan Universitas Mohammad Husni Thamrin adalah unit pendukung utama 
              yang mengelola akses literasi dan riset untuk mendukung kegiatan akademik. 
              Dengan sistem terintegrasi, kami memastikan setiap sivitas akademika 
              memiliki kemudahan dalam mengeksplorasi ilmu pengetahuan.
            </p>
            <button onClick={() => window.location.href = '/profil'} className="btn-more">
              Selengkapnya <ChevronRight size={18} />
            </button>
          </BrandStory>

          {/* Bagian Kanan: Bento Grid Stats (Terinspirasi Gambar 1) */}
          <StatsGrid>
            {stats.map((item) => (
              <StatCard key={item.id} bordercolor={item.color}>
                <div className="card-header">
                  <div className="icon-box" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="count" style={{ color: item.color }}>{item.count}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </StatCard>
            ))}
          </StatsGrid>
        </ContentGrid>
      </div>
    </SectionWrapper>
  );
}

// --- Styled Components ---

const SectionWrapper = styled.section`
  padding: 80px 0;
  background-color: #ffffff;
  
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BrandStory = styled.div`
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f1f5f9;
    color: #475569;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 20px;
    
    span {
      color: #0ea5e9;
    }
  }

  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.7;
    margin-bottom: 32px;
  }

  .btn-more {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background: #0ea5e9;
      transform: translateX(5px);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.bordercolor};
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
    transform: translateY(-5px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
  }

  .count {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
  }
`;