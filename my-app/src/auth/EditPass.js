import React from 'react'
import Navbar from '../components/Navbar'
import './register.css'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { FaChevronRight } from "react-icons/fa"

const EditPass = () => {
  return (
    <div id='transaksi-saya'>
    <Navbar/>
    <div style={{maxWidth:"30rem",margin:"3.5rem auto 2rem auto", paddingLeft:"0.2rem"}} >
    <h1 style={{padding:"2rem 0 0.5rem 0",color:"#01426a"}}>Pengaturan Akun</h1>
    <p style={{color:"#545454"}}>Selamat datang, <span style={{color:"black",fontWeight:"600"}}>Muh Syawal</span></p>
   <div style={{display:"flex", paddingTop:"2rem",gap:"1rem",alignItems:"center"}}>
    <Link to='/profil' style={{color:"#0088ff",textDecoration:"none"}}>Akun Anda</Link>
    < FaChevronRight  color='#545454' fill='#545454' size='0.8rem'/>
    <p style={{color:"black"}}>Edit Password</p>
   </div>
    </div>
    <div className='container-register' style={{margin:"1rem auto"}}>
        <div className='register-form'>
            <form>
                <div className='h2'>
                    <h3 style={{color:"black",fontSize:"1.5rem"}}>Edit Password</h3>
                </div>
                <div className='input'>
                    <p>Kata Sandi Saat Ini</p>
                    <input/>
                </div>
                <div>
                    <p>Kata Sandi Baru</p>
                    <input/>
                </div>
                <div className='submit'>
                    <button type='submit'>Simpan Perubahan</button>
                </div>
                <div className='login-submit'>
                    <p>Atau</p>
                    <Link to="/profil" className="link">Batalkan</Link>
                </div>
            </form>
        </div>
    </div>
    <Footer/>
</div>
  )
}

export default EditPass