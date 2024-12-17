import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
        
import Navbar from '../components/Navbar';

const Login = () => {
  const location = useLocation();
  const message = location.state?.message;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const captchaRef = useRef(null);
  const [token, setToken] = useState('');
  const [type,setType] = useState('password');
  



  const detect = localStorage.getItem('detectDevice')
  const navigate = useNavigate();

  const handleToggle = () => {
    if(type === 'password') {
      setType('text')
    }
    else {
      setType('password')
    }
  }

  useEffect(() => {
    const captchaContainer = captchaRef.current; // Simpan referensi elemen CAPTCHA

    const loadCaptchaScript = () => {
      const scriptId = 'turnstile-script';
      
      // Cek jika script sudah ada
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (captchaContainer && !captchaContainer.hasChildNodes()) {
            window.turnstile.render(captchaContainer, {
              sitekey: process.env.REACT_APP_SITE_KEY,
              callback: (response) => {
                setToken(response); // Store the response token
              },
            });
          }
        };
      }
    };
    loadCaptchaScript();

    return () => {
      // Cleanup script and CAPTCHA container
      const script = document.getElementById('turnstile-script');
      if (script) {
        document.body.removeChild(script);
      }
      if (captchaContainer) {
        captchaContainer.innerHTML = ''; // Clear CAPTCHA container
      }
    };
  }, []); // Kosongkan dependensi untuk memastikan efek ini hanya dijalankan sekali

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Email tidak valid. Harap masukkan email yang benar.');
      setLoading(false);
      return 
    }

    try {
      // Verifikasi token CAPTCHA
      const captchaResponse = await axios.post('/auth/api/verify-captcha', { token });
      if (captchaResponse.data.success) {
        // CAPTCHA valid, lanjutkan dengan login
        const response = await axios.post('/auth/login', { email, password,detect });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        navigate('/detail');
      } else {
        setErrorMsg('CAPTCHA tidak valid');
      }
    } catch (error) {
      console.log(error)
      console.error('Login error:', error); 
      if (error.response.status === 405) {
        localStorage.setItem('detectDevice',error.response.data.newDevice)
        setErrorMsg(error.response.data.message)
        return
      }

       
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Ada yang salah coba lagi nanti');
      }
    } finally {
      setLoading(false);
    }
  };

  return (<>
  <Navbar/>
    <div className='container-register'>
      <div className='register-form'>
        <form onSubmit={handleSubmit}>
          <div className='h2'>
            <h2>Login</h2>
            {message && <p className='messageSucces'>{message}</p>}
          </div>
          <div className='input'>
            <p>Masukkan Email Anda</p>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <p>Masukkan Password Anda</p>
            <div className='parent-password'>
            <input
              type= {type}
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /> 
            <div className='visibilty-pass' onClick={handleToggle}>{type === 'text' ? (
              <VisibilityIcon className='pass' style={{fill:'#545454'}}/>
            ) : (
              <VisibilityOffIcon className='pass' style={{fill:'#545454'}}/>
            )}
            </div>
            </div>
          </div>
          <div>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          </div>
          <div className='capcha' ref={captchaRef}></div>
          <div className='submit'>
            <button type='submit' disabled={loading}>
              {loading ? <div className='spinner'></div> : 'Masuk'}
            </button>
            <Link to='/forgot/password' className='forgot'>Lupa Password</Link>
          </div>
          <div className='login-submit'>
            <p>Atau</p>
            <Link to='/register' className='link'>Buat Akun</Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
