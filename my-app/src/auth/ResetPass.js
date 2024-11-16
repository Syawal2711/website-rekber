import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ResetPass = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                                <input
                                    type='password'
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='input'>
                                <p>Masukkan Kembali Password Baru Anda</p>
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
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
