import React, {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom'
import './register.css'
import axios from 'axios'
const Register = () => {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [errorMsg,setErrorMsg] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(password.length <= 7 ) {
      setErrorMsg('Password Anda Terlalu Pandek!');
      return;
    }
    if(password !== confirmPassword) {
      setErrorMsg('Password Dan Confirm Password Tidak Sama!');
      return;
    }
    try {
      const response = await axios.post('http://192.168.57.128:3001/auth/register', {
        email,password
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
        <button type='submit'>Buat Akun</button>
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
