import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from '../components/Navbar';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetPass = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [type,setType] = useState('password');
    const [newtype,setNewType] = useState('password')
    const navigate = useNavigate();

    let email, exp;
    const current = Math.floor(Date.now() / 1000);

    try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.email;
        exp = decodedToken.exp;
    } catch (error) {
        console.error('Invalid token', error);
        setErrorMsg('Tautan pengaturan ulang kata sandi tidak valid.');
    }


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validasi Password
        if (password.length <= 7) {
            setErrorMsg('Password Anda Terlalu Pendek!');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Password dan Konfirmasi Password Tidak Sama!');
            setLoading(false);
            return;
        }

        // Kirim Permintaan Reset Password
        try {
            await axios.post('/auth/reset-password', {
                newPassword: password,
                email,
            });
            navigate('/login', {
                state: {
                    message: 'Berhasil, Silahkan login ke akun anda dengan password baru Anda',
                },
            });
        } catch (error) {
            console.error(error);
            setErrorMsg('Gagal mereset password. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='container-register'>
                <div className='register-form'>
                    {(!email || !exp || exp < current) ? (
                        <div>
                            <p style={{ fontSize: '1rem', paddingTop: '2rem' }}>
                                Tautan pengaturan ulang kata sandi tidak valid atau kadaluwarsa. Silahkan minta ulang tautan baru {<Link to='/forgot/password' className='forgot' style={{ paddingBottom: "2rem" }}>di sini.</Link>}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className='h2'>
                                <h3 style={{ color: "black", fontSize: "1.5rem" }}>Setel Ulang Password Anda</h3>
                                {errorMsg && <p style={{ textAlign: 'center', color: "red" }}>{errorMsg}</p>}
                            </div>
                            <div className='input'>
                                <p>Masukkan Password Baru Anda</p>
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
                            <div className='input'>
                                <p>Masukkan Kembali Password Baru Anda</p>
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
                            <div className='submit'>
                                <button type='submit' disabled={loading}>
                                    {loading ? <div className='spinner'></div> : 'Lanjutkan'}
                                </button>
                            </div>
                            <div className='login-submit'>
                                <p>Atau</p>
                                <Link to="/login" className="link">Kembali</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResetPass;
