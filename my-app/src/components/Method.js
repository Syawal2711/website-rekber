import React from 'react'
import './Method.css';
import img6 from '../assets/images/6.png'
import { motion } from 'framer-motion';

export const Method = () => {
  return (
    <div className='method'>
        <div className='method-right'>
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

        style={{color:'black',marginBottom:'2rem'}}>Bagaimana Cara Menggunakan Jasa Rekber?</motion.h1>
        <motion.p
        initial={{opacity:0,
          y:100,
        }}
        whileInView={{
          opacity:1,
          y:0
        }}
        transition={{duration:1}}
        viewport={{ once: true }}
        >Kamu masih bingung bagaimana cara rekber di Syawalrekber.com? Jangan khawatir! Kamu bisa menggunakan Syawalrekber.com dengan sangat mudah dan cepat. Berikut ini adalah langkah-langkah yang harus kamu lakukan.</motion.p>
        </div>
        <motion.div
        initial={{
          opacity:0,
          x:50,
        }}
        whileInView={{
          opacity:1,
          x:0,
        }}
        transition={{duration:0.8}}
        viewport={{ once: true }}
        className='method-left'>
          <img src={img6} alt='img' 
          className='img' style={{width:'18rem',heigth:'auto',margin:'0 2rem'}}/>
          </motion.div>
    </div>
  )
}

export default Method;
