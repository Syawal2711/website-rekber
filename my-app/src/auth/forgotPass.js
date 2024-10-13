import React from 'react'
import Navbar from '../components/Navbar'
import './register.css'
import { Link } from 'react-router-dom'

const forgotPass = () => {
  return (
    <>
        <Navbar/>
        <div className='container-register'>
            <div className='register-form'>
                <form>
                    <div className='h2'>
                        <h3 style={{color:"black",fontSize:"1.5rem"}}>Reset Password Anda</h3>
                    </div>
                    <div className='input'>
                        <p>Masukkan Email Anda</p>
                        <input/>
                    </div>
                    <div className='submit'>
                        <button type='submit'>Lanjutkan</button>
                    </div>
                    <div className='login-submit'>
                        <p>Atau</p>
                        <Link to="/login" className="link">Kembali</Link>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default forgotPass