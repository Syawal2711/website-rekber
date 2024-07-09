import React, {useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios'
import './register.css'

const Login = () => {
  const location = useLocation();
  const message = location.state?.message;

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errorMsg,setErrorMsg] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.57.128:3001/auth/login', {
        email,
        password
      })
      const {accessToken} = response.data;
      localStorage.setItem('accessToken',accessToken);
      console.log(accessToken)
      navigate('/detail');
    } catch (error) {
      if(error.response && error.response.data) {
        setErrorMsg(error.response.data.message)
      }
      else{
        setErrorMsg('Ada yang salah coba lagi nanti')
      }
    }
  }
  return (
    <div className='container-register'>
      <div className='register-form'>
      <form onSubmit={handleSubmit}>
        <div className='h2'>
          <h2>Login</h2>
          {message && <p className='messageSucces'>{message}</p>}
          </div>
        <div className='input'>
          <p>Masukkan Email Anda</p>
          <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div>
          <p>Masukkan Password Anda</p>
          <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        < div>
          {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
        </div>
        <div className='submit'>
        <button type='submi'>Masuk</button>
        <Link to='/forgotpassword' className='forgot'>Lupa Password</Link>
        </div>
        <div className='login-submit'>
        <p>Atau</p>
        <Link to='/register' className='link'>Buat Akun</Link>
        </div>
      </form>
      </div>
    </div>
  )
}

export default Login
