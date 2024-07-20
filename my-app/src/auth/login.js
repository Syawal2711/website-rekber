import React, {useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios'
import './register.css'

const Login = () => {
  const location = useLocation();
  const message = location.state?.message;

  const [email,setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const [password,setPassword] = useState('');
  const [errorMsg,setErrorMsg] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    setTimeout(async () => {
      try {
        const response = await axios.post('/auth/login', {
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
      setLoading(false)
    },2000
  )
  
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
        <button type='submi' disabled={loading}>{loading ? <div className='spinner'></div> : 'Masuk'}</button>
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
