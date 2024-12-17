import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import Navbar from '../components/Navbar';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const captchaRef = useRef(null);
  const [type,setType] = useState('password');
  const [newtype,setNewType] = useState('password')

  const navigate = useNavigate();

  const handleToggle = () => {
    if(type === 'password') {
      setType('text')
    }
    else {
      setType('password')
    }
  }

  const newHandleToggle = () => {
    if(newtype === 'password') {
      setNewType('text')
    }
    else {
      setNewType('password')
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Email tidak valid. Harap masukkan email yang benar.');
      setLoading(false);
      return 
    }
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
        const response = await axios.post('/auth/register', {
          email,
          password,
          captchaToken: token, // Kirim token CAPTCHA
        });
        localStorage.setItem('detectDevice',response.data.detectDevice )
        console.log(response.data.detectDevice)
        navigate('/login', {
          state: {
            message: 'Berhasil, Cek email Anda untuk mengaktifkan akun Anda',
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
            <div className='parent-password'>
            <input
              type={type}
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
            <p>Konfirmasi Password Anda</p>
            <div className='parent-password'>
            <input
              type={newtype}
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
             <div className='visibilty-pass' onClick={newHandleToggle}>{newtype === 'text' ? (
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
