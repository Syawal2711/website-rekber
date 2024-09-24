import React from 'react'
import './intro.css'
import { motion } from 'framer-motion'
import img1 from '../assets/images/payment.png' 
const intro = () => {
  return (
    <div className='intro'>
      <motion.div
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
       className='intro-left'>
        <img src={img1} alt='img'/>
      </motion.div>
      <div className='intro-right'>
        <motion.h1
         initial={{
          opacity:0,
          y:-50,
        }}
        whileInView={{
          opacity:1,
          y:0,
        }}
        transition={{duration:0.8}}
        viewport={{ once: true }}
        >Apa Itu Rekening Bersama Atau Rekber?</motion.h1>
        <motion.p className='paragraff'
        initial={{opacity:0,
          x:50,
        }}
        whileInView={{
          opacity:1,
          x:0
        }}
        transition={{duration:1}}
        viewport={{ once: true }}> Syawalrekber.com menyediakan jasa sistem pembayaran dalam jual beli barang/jasa untuk membantu keamanan dan kenyamanan dalam bertransaksi jarak jauh. Dalam konteks bisnis antar-mitra, syawalrekber.com berfungsi sebagai pihak ketiga untuk menampung dana selama masa jual beli.</motion.p>
        <motion.p className='paragraff'
        initial={{opacity:0,
          x:50,
        }}
        whileInView={{
          opacity:1,
          x:0
        }}
        transition={{duration:1.2}}
        viewport={{ once: true }}>Saat pembeli membayarkan dana, penjual tidak langsung menerimanya, tapi disimpan oleh syawalrekber.com. Saat barang/jasa sudah terkirim dan diterima oleh pembeli, maka pembeli akan mengkonfirmasinya. Uang yang sudah tersimpan akan ditransfer ke rekening penjual sesuai dengan nominal pembelian. Sehingga, dari seluruh proses tersebut, pembeli mendapatkan barang yang diinginkan, penjual mendapatkan uang pembayaran </motion.p>
      </div>
    </div>
  )
}

export default intro