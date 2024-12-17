import React from 'react'
import './intro.css'
import img1 from '../assets/images/payment.png' 
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
const intro = () => {
  return (
    <div className='intro'>
      <div
       className='intro-left'>
        <img data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-offset="300"
      src={img1} alt='img'/>
      </div>
      <div className='intro-right'>
        <h1 data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        data-aos-offset="300"
     >Apa Itu Rekening Bersama Atau Rekber?</h1>
        <p data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-offset="300"
        data-aos-delay="350" className='paragraff'> SyawalRekber menyediakan jasa sistem pembayaran dalam jual beli barang/jasa untuk membantu keamanan dan kenyamanan dalam bertransaksi jarak jauh. Dalam konteks bisnis antar-mitra, SyawalRekber berfungsi sebagai pihak ketiga untuk menampung dana selama masa jual beli.</p>

        <p data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-offset="300"
        data-aos-delay="600" className='paragraff'>Saat pembeli membayarkan dana, penjual tidak langsung menerimanya, tapi disimpan oleh SyawalRekber. Saat barang/jasa sudah terkirim dan diterima oleh pembeli, maka pembeli akan mengkonfirmasinya. Uang yang sudah tersimpan akan ditransfer ke rekening penjual sesuai dengan nominal pembelian. Sehingga, dari seluruh proses tersebut, pembeli mendapatkan barang yang diinginkan, penjual mendapatkan uang pembayaran </p>
      </div>
    </div>
  )
}

export default intro