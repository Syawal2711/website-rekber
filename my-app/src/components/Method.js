import React from 'react'
import './Method.css';
import img6 from '../assets/images/6.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

export const Method = () => {
  return (
    <div id='tutorial' className='method'>
        <div className='method-right'>
        <h1  data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        data-aos-offset="300" style={{color:'black',marginBottom:'2rem'}}>Bagaimana Cara Menggunakan Jasa Rekber?</h1>
        <p data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="350"
        data-aos-offset="300">Kamu masih bingung bagaimana cara rekber di Syawalrekber.com? Jangan khawatir! Kamu bisa menggunakan Syawalrekber.com dengan sangat mudah dan cepat. Berikut ini adalah langkah-langkah yang harus kamu lakukan.</p>
        </div>
        <div
        className='method-left'>
          <img data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-offset="300" src={img6} alt='img' 
          className='img' style={{width:'18rem',heigth:'auto',margin:'0 2rem'}}/>
          </div>
    </div>
  )
}

export default Method;
