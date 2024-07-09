import React from 'react'
import './intro.css'
import img1 from '../assets/images/img1.png' 
const intro = () => {
  return (
    <div className='intro'>
      <div className='intro-left'>
        <img src={img1} alt='img'/>
      </div>
      <div className='intro-right'>
        <h1>Apa Itu Rekening Bersama Atau Rekber?</h1>
        <p className='paragraff'> Syawalrekber.com menyediakan jasa sistem pembayaran dalam jual beli barang/jasa untuk membantu keamanan dan kenyamanan dalam bertransaksi jarak jauh. Dalam konteks bisnis antar-mitra, syawalrekber.com berfungsi sebagai pihak ketiga untuk menampung dana selama masa jual beli.</p>
        <p className='paragraff'>Saat pembeli membayarkan dana, penjual tidak langsung menerimanya, tapi disimpan oleh syawalrekber.com. Saat barang/jasa sudah terkirim dan diterima oleh pembeli, maka pembeli akan mengkonfirmasinya. Uang yang sudah tersimpan akan ditransfer ke rekening penjual sesuai dengan nominal pembelian. Sehingga, dari seluruh proses tersebut, pembeli mendapatkan barang yang diinginkan, penjual mendapatkan uang pembayaran </p>
      </div>
    </div>
  )
}

export default intro