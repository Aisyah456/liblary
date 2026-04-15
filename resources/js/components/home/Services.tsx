import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Components
import ClientSlider from './parts/ClientSlider';
import ServiceBox from './elements/ServiceBox';

// 1. Definisi Interface yang lebih jelas
interface ServiceItem {
    id: number | string;
    is_active: boolean;
    order: number;
    icon: string;
    title: string;
    subtitle: string;
    features: string | string[];
    link?: string;
}

interface ServicesProps {
    initialData?: ServiceItem[]; // Opsional jika ingin data awal dari props
}

export default function Services({ initialData }: ServicesProps) {
    // 2. Ubah nama state agar tidak bentrok dengan props
    const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('/api/services');
                let data: ServiceItem[] = response.data;

                // 3. Filter, Sort, dan Parse sekaligus saat fetch
                const processedData = data
                    .filter(service => service.is_active)
                    .sort((a, b) => a.order - b.order)
                    .map(service => ({
                        ...service,
                        features: typeof service.features === 'string'
                            ? JSON.parse(service.features)
                            : service.features
                    }));

                setServiceList(processedData);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <Wrapper id="services">
            {/* 4. Gunakan Styled Components yang sudah dibuat */}
            <SliderSection className="lightBg">
                <div className="container">
                    <ClientSlider partners={undefined} />
                </div>
            </SliderSection>

            <ServiceSection className="whiteBg">
                <div className="container">
                    <HeaderInfo>
                        <h1>Layanan Unggulan Kami</h1>
                        <p>
                            Solusi digital terintegrasi untuk mendukung
                            kebutuhan literasi, akademik, dan riset Anda
                            di era modern.
                        </p>
                    </HeaderInfo>

                    {loading ? (
                        <Loading>Memuat layanan...</Loading>
                    ) : (
                        <ServiceGrid>
                                {serviceList.map((service) => (
                                    <ServiceCard key={service.id}>
                                        <ServiceBox
                                            icon={service.icon}
                                            title={service.title}
                                            subtitle={service.subtitle}
                                        />

                                        {Array.isArray(service.features) && (
                                            <FeatureList>
                                                {service.features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </FeatureList>
                                        )}

                                        <ButtonWrapper>
                                            <ReadMoreButton
                                                onClick={() => (window.location.href = service.link || '#')}
                                            >
                                                Read More →
                                            </ReadMoreButton>
                                        </ButtonWrapper>
                                    </ServiceCard>
                                ))}
                        </ServiceGrid>
                    )}
                </div>
            </ServiceSection>
        </Wrapper>
    );
}

/* ================= STYLES (Fixed Naming) ================= */

const Wrapper = styled.section`
    width: 100%;
`;

const HeaderInfo = styled.div`
    text-align: center;
    margin-bottom: 60px;
    h1 {
        font-size: 40px;
        font-weight: 800;
        margin-bottom: 10px;
    }
    p {
        color: #666;
        max-width: 600px;
        margin: auto;
        line-height: 1.6;
    }
`;

// Perbaikan: Awali dengan huruf kapital agar bisa digunakan sebagai Komponen
const SliderSection = styled.div`
    padding: 50px 0;
`;

const ServiceSection = styled.div`
    padding: 70px 0;
`;

const ServiceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
`;

const ServiceCard = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
`;

const FeatureList = styled.ul`
    margin-top: 20px;
    padding: 0;
    list-style: none;
    flex-grow: 1;

    li {
        font-size: 13px;
        color: #666;
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;

        &:before {
            content: "✓";
            color: #2563eb;
            font-weight: bold;
            margin-right: 10px;
        }
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 25px;
    text-align: center;
`;

const ReadMoreButton = styled.button`
    border: 1px solid #2563eb;
    color: #2563eb;
    background: transparent;
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #eff6ff;
    }
`;

const Loading = styled.p`
    text-align: center;
    padding: 40px;
`;