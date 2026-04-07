import React, { useState } from 'react';
import styled from 'styled-components';
// Import axios jika Anda menggunakannya, atau gunakan fetch bawaan browser
// import axios from 'axios'; 

import { 
    Heart, MessageSquare, BookOpen, Monitor, 
    Coffee, Send, Star, CheckCircle, 
    AlertCircle, HelpCircle
} from 'lucide-react';

const categories = [
    {
        id: 'koleksi',
        icon: <BookOpen size={24} />,
        title: "Koleksi Buku",
        desc: "Ketersediaan buku fisik, keberagaman judul, dan kondisi fisik buku.",
        color: "#6366f1"
    },
    {
        id: 'layanan_digital',
        icon: <Monitor size={24} />,
        title: "Layanan Digital",
        desc: "E-journal, Repository, kecepatan Wi-Fi, dan kemudahan akses OPAC.",
        color: "#0ea5e9"
    },
    {
        id: 'lingkungan',
        icon: <Coffee size={24} />,
        title: "Fasilitas & Ruang",
        desc: "Kebersihan, kenyamanan ruang baca, AC, dan ketersediaan stopkontak.",
        color: "#f59e0b"
    },
    {
        id: 'staf',
        icon: <Star size={24} />,
        title: "Kualitas Layanan",
        desc: "Keramahan pustakawan, kecepatan respon, dan bantuan referensi.",
        color: "#10b981"
    }
];

export default function LibrarySurveySupport() {
    const [formData, setFormData] = useState({ 
        category: '', 
        rating: 5, 
        message: '',
        type: 'Saran/Aduan' 
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi sederhana jika kategori belum dipilih
        if (!formData.category) {
            alert("Silahkan pilih kategori terlebih dahulu di atas.");
            return;
        }

        setLoading(true);

        try {
            // Sesuaikan URL dengan alamat backend Laravel Anda
            const response = await fetch('http://localhost:8000/api/library-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
                // Reset form setelah berhasil
                setFormData({ category: '', rating: 5, message: '', type: 'Saran/Aduan' });
            } else {
                alert("Gagal mengirim masukan: " + (result.message || "Terjadi kesalahan server"));
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Gagal terhubung ke server. Pastikan backend Laravel menyala.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <SuccessWrapper>
                <CheckCircle size={64} color="#10b981" />
                <h2>Terima Kasih!</h2>
                <p>Kontribusi Anda membantu kami meningkatkan kualitas layanan perpustakaan.</p>
                <button onClick={() => setSubmitted(false)}>Kirim Masukan Lain</button>
            </SuccessWrapper>
        );
    }

    return (
        <SupportWrapper id="library-feedback">
            <div className="container">
                <SectionHeader>
                    <div className="badge">
                        <Heart size={14} />
                        Survey & Pengaduan
                    </div>
                    <h2>Suara Pemustaka</h2>
                    <p>Bantu kami menjadi lebih baik. Berikan rating kepuasan Anda atau laporkan kendala yang Anda alami selama di perpustakaan.</p>
                </SectionHeader>

                <ComplaintGrid>
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} color={cat.color} active={formData.category === cat.title}>
                            <div className="icon-box">{cat.icon}</div>
                            <h3>{cat.title}</h3>
                            <p>{cat.desc}</p>
                            <button 
                                type="button" // Penting: agar tidak trigger submit form
                                onClick={() => setFormData({...formData, category: cat.title})}
                            >
                                {formData.category === cat.title ? 'Terpilih' : 'Pilih Kategori'}
                            </button>
                        </CategoryCard>
                    ))}
                </ComplaintGrid>

                <SupportContent>
                    <ComplaintForm onSubmit={handleSubmit}>
                        <div className="form-header">
                            <MessageSquare size={20} />
                            <h3>Formulir Masukan</h3>
                        </div>
                        
                        <div className="input-group">
                            <label>Kategori Masukan</label>
                            <input 
                                type="text" 
                                value={formData.category} 
                                readOnly
                                placeholder="Klik 'Pilih Kategori' di atas..."
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Tingkat Kepuasan (1-5)</label>
                            <div className="rating-selector">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Star 
                                        key={num}
                                        size={28} 
                                        fill={num <= formData.rating ? "#f59e0b" : "none"}
                                        color={num <= formData.rating ? "#f59e0b" : "#cbd5e1"}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setFormData({...formData, rating: num})}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Detail Pesan / Aduan</label>
                            <textarea 
                                rows="4" 
                                required
                                placeholder="Tuliskan saran, kritik, atau detail kendala Anda secara spesifik..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? "Mengirim..." : "Kirim Feedback"} <Send size={16} />
                        </SubmitButton>
                    </ComplaintForm>

                    <StatusInfo>
                        <InfoBox>
                            <AlertCircle size={28} color="#ef4444" />
                            <div>
                                <h4>Kritik Membangun</h4>
                                <p>Setiap aduan terkait fasilitas akan segera ditindaklanjuti oleh tim sarpras dalam 2x24 jam.</p>
                            </div>
                        </InfoBox>
                        
                        <InfoBox>
                            <HelpCircle size={28} color="#0ea5e9" />
                            <div>
                                <h4>Butuh Respon Cepat?</h4>
                                <p>Gunakan fitur Live Chat di pojok kanan bawah untuk bantuan langsung dari Pustakawan Referensi.</p>
                            </div>
                        </InfoBox>

                        <ContactAlert>
                            <p>Layanan Pengaduan via WA:</p>
                            <strong>+62 811-LIB-UNIV</strong>
                            <span className="jam-layanan">Senin - Jumat (08.00 - 16.00)</span>
                        </ContactAlert>
                    </StatusInfo>
                </SupportContent>
            </div>
        </SupportWrapper>
    );
}

// ... Styled Components tetap sama seperti sebelumnya ...
const SupportWrapper = styled.section`
    padding: 80px 0;
    background-color: #f8fafc;
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
`;

const SectionHeader = styled.div`
    text-align: center; margin-bottom: 50px;
    .badge {
        display: inline-flex; align-items: center; gap: 8px;
        background: #eef2ff; color: #6366f1; padding: 6px 16px;
        border-radius: 99px; font-size: 0.8rem; font-weight: 700; margin-bottom: 15px;
    }
    h2 { font-size: 2.2rem; color: #0f172a; margin-bottom: 10px; }
    p { color: #64748b; max-width: 600px; margin: 0 auto; line-height: 1.6; }
`;

const ComplaintGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
`;

const CategoryCard = styled.div`
    background: white; border-radius: 20px; padding: 25px;
    border: 2px solid ${props => props.active ? props.color : '#e2e8f0'}; 
    transition: all 0.3s ease;
    transform: ${props => props.active ? 'translateY(-5px)' : 'none'};
    
    .icon-box {
        width: 48px; height: 48px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        background: ${props => props.color + '15'};
        color: ${props => props.color}; margin-bottom: 15px;
    }

    h3 { font-size: 1.1rem; margin-bottom: 10px; color: #0f172a; }
    p { font-size: 0.85rem; color: #64748b; margin-bottom: 20px; line-height: 1.5; }
    
    button {
        background: ${props => props.active ? props.color : 'transparent'}; 
        color: ${props => props.active ? 'white' : 'inherit'};
        border: 1px solid ${props => props.active ? props.color : '#e2e8f0'};
        width: 100%; padding: 8px; border-radius: 8px;
        font-size: 0.85rem; font-weight: 600; cursor: pointer;
        transition: 0.2s;
        &:hover { background: ${props => props.color}; color: white; }
    }
`;

const SupportContent = styled.div`
    display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ComplaintForm = styled.form`
    background: white; padding: 30px; border-radius: 24px;
    border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);

    .form-header {
        display: flex; align-items: center; gap: 10px; margin-bottom: 25px;
        color: #6366f1; h3 { color: #0f172a; margin: 0; }
    }

    .input-group {
        margin-bottom: 20px;
        label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: #475569; }
        input, textarea {
            width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px;
            font-family: inherit; font-size: 0.95rem; background: #f8fafc;
            &:focus { outline: none; border-color: #6366f1; background: white; }
        }
    }

    .rating-selector {
        display: flex; gap: 10px; margin-bottom: 10px;
    }
`;

const SubmitButton = styled.button`
    width: 100%; background: #0f172a; color: white; border: none;
    padding: 14px; border-radius: 10px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer; transition: 0.2s;
    &:disabled { background: #94a3b8; cursor: not-allowed; }
    &:hover:not(:disabled) { background: #6366f1; transform: translateY(-2px); }
`;

const StatusInfo = styled.div`
    display: flex; flex-direction: column; gap: 20px;
`;

const InfoBox = styled.div`
    display: flex; gap: 15px; padding: 20px; background: white;
    border-radius: 16px; border: 1px solid #e2e8f0;
    h4 { margin: 0 0 5px 0; color: #0f172a; font-size: 1rem; }
    p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; }
`;

const ContactAlert = styled.div`
    background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%); 
    color: white; padding: 25px; border-radius: 16px; text-align: center;
    p { margin: 0 0 5px 0; font-size: 0.9rem; opacity: 0.9; }
    strong { font-size: 1.2rem; letter-spacing: 1px; display: block; margin-bottom: 5px; }
    .jam-layanan { font-size: 0.75rem; opacity: 0.8; font-style: italic; }
`;

const SuccessWrapper = styled.div`
    text-align: center; padding: 100px 20px;
    h2 { margin: 20px 0 10px; color: #0f172a; }
    p { color: #64748b; margin-bottom: 30px; }
    button { 
        padding: 12px 24px; border-radius: 10px; border: none; 
        background: #6366f1; color: white; font-weight: 600; cursor: pointer;
    }
`;