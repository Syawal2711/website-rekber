import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaChevronRight } from "react-icons/fa";
import IconsProfil from '@mui/icons-material/AccountBoxRounded'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Profil(){
  const navigate = useNavigate()
  const aksesToken = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(aksesToken)
  
  const resetpass = () => {
    navigate('/profil/password')
  }
  const toprofil = () => {
    navigate('/profil/myprofil')
  }

  
  return (
    <div id='transaksi-saya'>
      <Navbar />
      <div style={{maxWidth:"30rem",margin:"3.5rem auto 2rem auto",paddingLeft:"0.2rem"}}>
      <h1 style={{padding:"2rem 0 0.5rem",color:"#01426a"}}>Pengaturan Akun</h1>
      <p style={{color:"#545454"}}>Selamat datang, <span style={{color:"black",fontWeight:"600"}}>{decodedToken.name ? decodedToken.name : decodedToken.email}</span></p>
      </div>
      <div className='container-transaksi' style={{ padding: '1rem' }}>
        <div className='line'  onClick={toprofil}  style={{display:"flex",justifyContent:"space-between", padding: '0 0 1rem 0',alignItems:"center", cursor: 'pointer'}}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
          <IconsProfil style={{ fill:"#0088ff"}}/>
          <p style={{ fontWeight: '600', color: 'black' }}>Informasi Pribadi</p>
          </div>
          <div>
          <FaChevronRight color='#545454' fill='#545454'/>
          </div>
        </div>
        <div className='line' style={{ padding: '1rem 0' }}>
          <p style={{color:'black'}}>Nama</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>{decodedToken.name ? decodedToken.name : 'Tidak Di Atur'}</p>
        </div>
        <div className='line' style={{ padding: '1rem 0' }}>
          <p style={{ color: 'black' }}>Alamat Email</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>{decodedToken.email}</p>
        </div>
        <div style={{ padding: '1rem 0' }}>
          <p style={{ color: 'black' }}>No Handphone</p>
          <p style={{ color: 'black', fontWeight: '600', paddingTop: '1rem' }}>{decodedToken.noHp? decodedToken.noHp:'Tidak Di Atur'}</p>
        </div>
      </div>
      <div onClick={resetpass} className='container-transaksi' style={{padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.2rem"}}>
          <IconsProfil style={{ fill:"#0088ff"}}/>
        <div>
        <p style={{color:"black",fontSize:"1.1rem"}}>Password</p>
        <p style={{color:"#545454",paddingTop:"0.5rem"}}>Edit Password</p>
        </div>
        </div>
        <FaChevronRight color='#545454' fill="#545454"/>
      </div>
      <Footer />
    </div>
  );
}

