import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Components
import ClientSlider from './parts/ClientSlider';
import ServiceBox from './elements/ServiceBox';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('/api/services');

                let data = response.data;

                // Filter hanya service aktif
                data = data.filter(service => service.is_active);

                // Sorting berdasarkan order
                data = data.sort((a, b) => a.order - b.order);

                setServices(data);

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

            {/* Client Logo Slider */}
            <div className="lightBg sliderSection">
                <div className="container">
                    <ClientSlider />
                </div>
            </div>

            {/* Service Section */}
            <div className="whiteBg serviceSection">
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

                            {services.map((service) => {

                                const features =
                                    typeof service.features === 'string'
                                        ? JSON.parse(service.features)
                                        : service.features;

                                return (
                                    <ServiceCard key={service.id}>

                                        <ServiceBox
                                            icon={service.icon}
                                            title={service.title}
                                            subtitle={service.subtitle}
                                        />

                                        {features && (
                                            <FeatureList>
                                                {features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </FeatureList>
                                        )}

                                        <ButtonWrapper>
                                            <ReadMoreButton
                                                onClick={() =>
                                                    (window.location.href =
                                                        service.link || '#')
                                                }
                                            >
                                                Read More →
                                            </ReadMoreButton>
                                        </ButtonWrapper>

                                    </ServiceCard>
                                );
                            })}

                        </ServiceGrid>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

/* ================= STYLES ================= */

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

const sliderSection = styled.div`
    padding: 50px 0;
`;

const serviceSection = styled.div`
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

    li {
        font-size: 13px;
        color: #666;
        margin-bottom: 10px;

        &:before {
            content: "✓";
            color: #0b1b35;
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