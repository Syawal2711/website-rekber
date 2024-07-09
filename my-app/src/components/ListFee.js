import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import './ListFee.css';

const pricingData = [
  {
    title: "Biaya Transaksi",
    range: "10K - 20K",
    price: "5K",
  },
  {
    title: "Biaya Transaksi",
    range: "21K - 290K",
    price: "10K",
  },
  {
    title: "Biaya Transaksi",
    range: "291K - 490K",
    price: "20K",
  },
  {
    title: "Biaya Transaksi",
    range: "491K - 790K",
    price: "25K",
  },
  {
    title: "Biaya Transaksi",
    range: "791K - 900K",
    price: "30K",
  },{
    title: "Biaya Transaksi",
    range: "901K - 999K",
    price: "40K",
  },
  {
    title: "Biaya Transaksi",
    range: "1Jt - 1.9Jt",
    price: "50K",
  },
  {
    title: "Biaya Transaksi",
    range: "2Jt - 2.9Jt",
    price: "60K",
  },
  {
    title: "Biaya Transaksi",
    range: "3Jt - 3.9Jt",
    price: "70K",
  },
  {
    title: "Biaya Transaksi",
    range: "4Jt - 10.9Jt",
    price: "80K",
  },{
    title: "Biaya Transaksi",
    range: "11Jt - 15.9Jt",
    price: "90K",
  },
  {
    title: "Biaya Transaksi",
    range: "16Jt - 20.9Jt",
    price: "100K",
  },
  {
    title: "Biaya Transaksi",
    range: "21Jt- 30Jt",
    price: "200k",
  },
  {
    title: "Biaya Transaksi",
    range: "30Jt - Seterusnya",
    price: "250k",
  },

  // Tambahkan data lainnya sesuai kebutuhan
];

const ListFee = () => {
  return (
    <div className='sliders'>
      <h1>Biaya Transaksi</h1>
      <div className='parag'>
      <p>Kami memberikan tariff biaya termurah se Indonesia, dengan biaya mulai dari 5 ribu.</p>
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
          slidesPerView: 4,
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
              <span className="pricing-currency">IDR</span>
              <span className="pricing-price">{item.price}</span>
            </div>
            <div className="pricing-footer">
              <button className="pricing-button">Transaksi Sekarang</button>
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