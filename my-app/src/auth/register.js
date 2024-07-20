import React, {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom'
import './register.css'
import axios from 'axios'
const Register = () => {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [errorMsg,setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    if(password.length <= 7 ) {
      setErrorMsg('Password Anda Terlalu Pandek!');
      return;
    }
    if(password !== confirmPassword) {
      setErrorMsg('Password Dan Confirm Password Tidak Sama!');
      return;
    }
    setTimeout(async() => {
      try {
        const response = await axios.post(`/auth/register`,{
          email,password
        }, {
          credentials: 'include'
        })
        navigate('/login', {state: {
          message: 'Berhasil,cek email anda untuk mengaktifkan akun Anda'
        }})
      } catch (error) {
        if(error.response && error.response.data){
          setErrorMsg(error.response.data.message)
        }
        else {
          setErrorMsg('Ada yang salah coba lagi nanti')
        }
      }
      setLoading(false)
    },2000)
    
  }
  return (
    <div className='container-register'>
      <div className='register-form'>
      <form onSubmit={handleSubmit}>
        <div className='h2'>
          <h2>Buat Akun</h2>
          </div>
        <div className='input'>
          <p>Masukkan Email Anda</p>
          <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div>
          <p>Masukkan Password Anda</p>
          <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div>
          <p>Konfirmasi Password Anda</p>
          <input type='password' name='confrimpassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
        </div>
        < div>
          {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
        </div>
        <div className='submit'>
        <button type='submit' disabled ={loading}>{loading ? <div className='spinner'></div> : 'Buat Akun'}</button>
        </div>
        <div className='login-submit'>
        <p>Atau</p>
        <Link to='/login' className='link'>Login</Link>
        </div>
      </form>
      </div>
    </div>
  )
}

export default Register
