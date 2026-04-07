import React from "react";
import Slider from "react-slick";
import styled from "styled-components";

export default function ClientSlider({ partners }) {
  if (!partners || partners.length === 0) {
    return null; 
  }

  const settings = {
    infinite: partners.length > 6, 
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1, // Diubah ke 1 agar pergerakan lebih halus
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    cssEase: "linear", // Opsional: membuat transisi lebih smooth
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    // py-4 atau py-6 biasanya cukup untuk section partner
    <div className="py-6 w-full overflow-hidden bg-white"> 
      <Slider {...settings}>
        {partners.map((partner) => (
          <LogoWrapper key={partner.id}>
            <ImgStyle 
              src={partner.logo} 
              alt={partner.name}
              title={partner.name}
            />
          </LogoWrapper>
        ))}
      </Slider>
    </div>
  );
}

const LogoWrapper = styled.div`
  width: 100%;
  /* Dikurangi dari 100px ke 60px agar tidak terlalu memakan ruang vertical */
  height: 60px; 
  display: flex !important;
  justify-content: center;
  align-items: center;
  outline: none;
  padding: 0 10px; /* Jarak antar logo kiri-kanan */
`;

const ImgStyle = styled.img`
  max-width: 140px; /* Batasi lebar maksimal logo */
  max-height: 45px; /* Batasi tinggi maksimal logo di dalam wrapper */
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.3s ease-in-out;

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05); /* Sedikit efek zoom saat hover */
  }
`;