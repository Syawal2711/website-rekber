import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css/bundle';
import './ListFee.css';
import { pricingData } from '../all/allFunction'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const ListFee = () => {
  const navigate = useNavigate()
  const handleLink = () => {
    navigate('/detail')
  }
  return (
    <div id='list-fee' className='sliders'>
      <h1  data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-offset="300">Biaya Transaksi</h1>
      <div className='parag'>
      <p  data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        data-aos-offset="300" style={{padding:'0 1rem'}}>Kami memberikan tarif biaya termurah se Indonesia, dengan biaya mulai dari 5 ribu.</p>
      </div>
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      loop={false}
      navigation={false}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }}
    >
      {pricingData.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="swiper-container">
          <div className="pricing-item">
            <div className="pricing-header">
              <h2 className="pricing-title">{item.title}</h2>
              <p className="pricing-range">{item.range}</p>
            </div>
            <div className="pricing-body">
              <span className="pricing-currency"></span>
              <span className="pricing-price">{item.price}</span>
            </div>
            <div className="pricing-footer">
              <button onClick={handleLink}  style={{border:'none'}} className="pricing-button">Transaksi Sekarang</button>
            </div>
          </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
};

export default ListFee;