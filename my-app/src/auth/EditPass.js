import React from 'react'
import Navbar from '../components/Navbar'
import './register.css'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const EditPass = () => {
  return (
    <div id='transaksi-saya'>
    <Navbar/>
    <div style={{maxWidth:"30rem",margin:"0 auto"}} >
    <h1 style={{padding:"2rem 0 0 1rem",color:"#01426a"}}>Pengaturan Akun</h1>
    </div>
    <div className='container-register'>
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
                    <Link to="/login" className="link">Batalkan</Link>
                </div>
            </form>
        </div>
    </div>
    <Footer/>
</div>
  )
}

export default EditPass