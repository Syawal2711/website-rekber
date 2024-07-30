import React from 'react'
import './Method.css';
import img6 from '../assets/images/6.png'

export const Method = () => {
  return (
    <div className='method'>
        <div className='method-right'>
        <h1 style={{color:'black',marginBottom:'2rem'}}>Bagaimana Cara Menggunakan Jasa Rekber?</h1>
        <p>Kamu masih bingung bagaimana cara rekber di Syawalrekber.com? Jangan khawatir! Kamu bisa menggunakan Syawalrekber.com dengan sangat mudah dan cepat. Berikut ini adalah langkah-langkah yang harus kamu lakukan.</p>
        </div>
        <div className='method-left'>
          <img src={img6} alt='img' style={{width:'20rem',heigth:'auto',marginLeft:'2rem'}}/>
          </div>
    </div>
  )
}

export default Method;
