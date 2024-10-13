import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './register.css';
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

  const navigate = useNavigate();


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
                console.log('CAPTCHA response:', response); // Debugging line
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

    try {
      // Verifikasi token CAPTCHA
      const captchaResponse = await axios.post('/auth/api/verify-captcha', { token });
      if (captchaResponse.data.success) {
        // CAPTCHA valid, lanjutkan dengan login
        const response = await axios.post('/auth/login', { email, password });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        console.log('Access Token:', accessToken); // Debugging line
        navigate('/detail');
      } else {
        setErrorMsg('CAPTCHA tidak valid');
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging line
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
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
