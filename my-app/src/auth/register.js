import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import Navbar from '../components/Navbar';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const captchaRef = useRef(null);

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length <= 7) {
      setErrorMsg('Password Anda Terlalu Pendek!');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password Dan Konfirmasi Password Tidak Sama!');
      setLoading(false);
      return;
    }

    try {
      const captchaResponse = await axios.post('/auth/api/verify-captcha', { token });
      if(captchaResponse.data.success) {
        await axios.post('/auth/register', {
          email,
          password,
          captchaToken: token, // Kirim token CAPTCHA
        });
        navigate('/login', {
          state: {
            message: 'Berhasil, cek email Anda untuk mengaktifkan akun Anda',
          },
        });
      }
      else {
        setErrorMsg('CAPTCHA tidak valid');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Ada yang salah, coba lagi nanti');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className='container-register'>
      <div className='register-form'>
        <form onSubmit={handleSubmit}>
          <div className='h2'>
            <h2>Buat Akun</h2>
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
            <p>Konfirmasi Password Anda</p>
            <input
              type='password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          </div>
          <div ref={captchaRef}></div>
          <div className='submit'>
            <button type='submit' disabled={loading}>
              {loading ? <div className='spinner'></div> : 'Buat Akun'}
            </button>
          </div>
          <div className='login-submit'>
            <p>Atau</p>
            <Link to='/login' className='link'>Login</Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
