import React from 'react'
import img from '../assets/images/7.png';
import './Choose.css'

function Choose() {
    return (
        <div className='choose' style={{width:'60rem',maxWidth:'100%',padding:'1rem',margin:'2rem auto',paddingTop:'5rem'}}>
            <h1 style={{color:'black'}}>Kenapa Memilih Rekber Syawalrekber.com</h1>
            <div style={{display:'flex',flexWrap:'wrap',padding:'0 2rem'}}>
                <div style={{flex:'0 0 40%',justifyContent:'center',alignItems:'center'}}>
                <img src={img} alt='img' style={{width:'18rem',height:'auto'}}/>
                </div>
                <div className='poin'>
                    <p>1.Transaksi Aman: Menjamin keamanan dengan sistem rekening bersama yang mencegah penipuan dan memastikan kewajiban terpenuhi.</p>
                    <p>2.Transaksi Beridentitas: Anda bisa membuat transaksi beridentitas sesuai kesepakatan untuk meningkatkan kepercayaan dan keamanan.</p>
                    <p>3.Integrasi Xendit: Mendukung berbagai metode pembayaran, mempercepat transaksi, dan menyediakan fitur canggih.</p>
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