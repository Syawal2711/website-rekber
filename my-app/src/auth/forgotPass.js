import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import './register.css'
import { Link } from 'react-router-dom'


const ForgotPass = () => {
    const [loading, setLoading] = useState(false);
    const [succes,setSucces] = useState(false)
    const [email,setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
           await axios.post('/auth/request-reset-password',{
                email
            })
            setSucces(true)
        setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    
  return (
    <>
        <Navbar/>
        <div className='container-register'>
            <div className='register-form'>
            <div className='h2'>
                        <h3 style={{color:"black",fontSize:"1.5rem"}}>Reset Password Anda</h3>
            </div>
          {succes && <div>
            <p style={{fontSize:'1rem'}}>Kami telah mengirim link ke {email} yang dapat Anda akses untuk mereset password Anda segera</p>
            <Link to='/login' className='forgot'style={{paddingBottom:"2rem"}}>Kembali ke halaman login</Link>
           </div>} 
                {!succes && <form  onSubmit={handleSubmit}>
                    <div className='input'>
                        <p>Masukkan Email Anda</p>
                        <input type='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    </div>
                    <div className='submit'>
                        <button type='submit' disabled={loading}>{loading ? <div className='spinner'></div>:'Lanjutkan'}</button>
                    </div>
                    <div className='login-submit'>
                        <p>Atau</p>
                        <Link to="/login" className="link">Kembali</Link>
                    </div>
                </form>}
            </div>
        </div>
    </>
  )
}

export default ForgotPass