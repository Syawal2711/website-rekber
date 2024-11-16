import React from 'react'
import {Link} from 'react-scroll'
import img1 from '../assets/images/1.png'
import img2 from '../assets/images/2.png'
import img3 from '../assets/images/3.png'
import img4 from '../assets/images/4.png'
import img5 from '../assets/images/5.png'
import './Method1.css'

const Method1 = () => {
  return (
    <>
    <div  className='img-container'>
        <div className='img-image'>
            <img src={img1} alt='img1'/>
            <p>1. Penjual Dan Pembeli Menyetujui Transaksi</p>
        </div>
        <div className='img-image'>
            <img src={img2} alt='img2' />
            <p>2.Pembeli Melakukan Pembyaran  Ke syawalrekber.com</p>
        </div>
        <div className='img-image'>
            <img src={img3} alt='img3'/>
            <p>3.Penjual Dan Pembeli Melakukan Transaksi</p>
        </div>
        <div className='img-image'>
            <img src={img4} alt='img4'/>
            <p>4.Pembeli Mengkonfirmasi Produk/Jasanya</p>
        </div>
        <div className='img-image'>
            <img src={img5} alt='img5'/>
            <p>Syawalrekber.com Melakukan Pembayaran Ke Penjual</p>
        </div>
    </div>
    <div className='Method-button'>
    <Link
        activeClass="active"
        to="home"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        >
        <button style={{marginTop:'2rem'}}>Buat Rekber</button>
        </Link>
        </div>
    </>
  )
}

export default Method1