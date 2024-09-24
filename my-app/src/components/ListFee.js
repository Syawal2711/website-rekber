import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css/bundle';
import { motion } from 'framer-motion';
import './ListFee.css';
import { pricingData } from '../all/allFunction'

const ListFee = () => {
  const navigate = useNavigate()
  const handleLink = () => {
    navigate('/detail')
  }
  return (
    <div id='list-fee' className='sliders'>
      <motion.h1
      initial={{
        opacity:0,
        x:-50
      }}
      whileInView={{
        opacity:1,
        x:0
      }}
      transition={{duration:'0.8'}}
      viewport={{ once: true }}
      >Biaya Transaksi</motion.h1>
      <div className='parag'>
      <motion.p
      initial={{
        opacity:0,
        x:50
      }}
      whileInView={{
        opacity:1,
        x:0
      }}
      transition={{duration:'0.8'}}
      viewport={{ once: true }}
      style={{padding:'0 1rem'}}>Kami memberikan tarif biaya termurah se Indonesia, dengan biaya mulai dari 5 ribu.</motion.p>
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