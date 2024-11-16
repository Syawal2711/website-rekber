import React from 'react'
import img from '../assets/images/7.png';
import './Choose.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

function Choose() {
    return (
        <div className='choose' style={{width:'60rem',maxWidth:'100%',padding:'1rem',margin:'2rem auto',paddingTop:'5rem',overflowX: 'hidden'}}>
            <h1 data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-offset="300" style={{color:'black',padding:'0 1rem'}}>Kenapa Memilih Rekber Syawalrekber.com</h1>
            <div style={{display:'flex',flexWrap:'wrap',padding:'0 2rem'}}>
                <div style={{flex:'0 0 40%',justifyContent:'center',alignItems:'center'}}>
                <img data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        data-aos-offset="300" src={img} alt='img' style={{width:'18rem',height:'auto'}}/>
                </div>
                <div className='poin'>
                    <p>1.Transaksi Aman: Menjamin keamanan dengan sistem rekening bersama yang mencegah penipuan dan memastikan kewajiban terpenuhi.</p>
                    <p>2.Transaksi Bergaransi: Anda dapat memilih opsi transaksi bergaransi sesuai dengan kesepakatan untuk meningkatkan kepercayaan dan keamanan. Garansi ini memberikan perlindungan jika terjadi masalah dengan barang, memastikan bahwa hak Anda sebagai pembeli dilindungi.</p>
                    <p>3.Integrasi Xendit: Menyediakan dukungan untuk berbagai metode pembayaran, mempercepat proses transaksi  untuk meningkatkan efisiensi dan pengalaman pengguna. Dengan Xendit, Anda dapat mengelola pembayaran dengan lebih mudah,cepat dan aman.</p>
                    <p>4.Transaksi Transparan: Setiap tahap transaksi dapat dilacak oleh pembeli dan penjual untuk transparansi penuh.</p>
                    <p>5.Layanan Pelanggan Cepat: Dukungan pelanggan yang responsif untuk menyelesaikan masalah atau pertanyaan.</p>
                    <p>6.Notifikasi Real-Time: Memberikan notifikasi langsung tentang status transaksi.</p>
                    <p>7.Antarmuka Ramah: Desain intuitif dan mudah digunakan untuk navigasi dan penyelesaian transaksi.</p>
                    <p>8.Biaya Kompetitif: Menawarkan biaya layanan yang kompetitif dan transparan, meningkatkan kenyamanan pengguna.</p>
                </div>
            </div>
        </div>
    )
}

export default Choose;