import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaChevronRight } from "react-icons/fa";

export default function Profil(){
  return (
    <div id='transaksi-saya'>
      <Navbar />
      <h1 style={{padding:"2rem 0 0.5rem 1rem",color:"#01426a"}}>Pengaturan Akun</h1>
      <p style={{color:"#545454", paddingLeft:"1rem"}}>Selamat datang, <span style={{color:"black",fontWeight:"600"}}>Muh Syawal</span></p>
      <div className='container-transaksi' style={{ padding: '1rem' }}>
        <div className='line'>
          <p style={{ fontWeight: '600', color: 'black', padding: '0.5rem 0 1rem 0' }}>Informasi Pribadi</p>
          <FaChevronRight/>
        </div>
        <div className='line' style={{ padding: '1rem 0' }}>
          <p style={{ color: 'black' }}>Nama</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>Muh Syawal</p>
        </div>
        <div className='line' style={{ padding: '1rem 0' }}>
          <p style={{ color: 'black' }}>Alamat Email</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>s19199346@gmail.com</p>
        </div>
        <div style={{ padding: '1rem 0' }}>
          <p style={{ color: 'black' }}>No Handphone</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>08575677777</p>
        </div>
      </div>
      <div className='container-transaksi' style={{padding:"1rem"}}>
        <p style={{color:"black",fontSize:"1.1rem"}}>Password</p>
        <p style={{color:"#545454",paddingTop:"0.5rem"}}>Edit Password</p>
      </div>
      <Footer />
    </div>
  );
}

