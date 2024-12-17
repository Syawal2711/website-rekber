import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaChevronRight } from "react-icons/fa";
import { alertsucces } from '../all/allFunction';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const EditPass = () => {
    const aksesToken = localStorage.getItem('accessToken');
    const decodedToken = aksesToken ? jwtDecode(aksesToken) : null;
    const navigate = useNavigate();
    const [changeData, setChangeData] = useState({ password: '', newPassword: '' });
     const [type,setType] = useState('password');
     const [newtype,setNewType] = useState('password')
     const [error,setError] = useState('')

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangeData({
            ...changeData,
            [name]: value,
        });
    };
    
    const newPassword = async (e) => {
        e.preventDefault();
        if(changeData.password === changeData.newPassword) {
            return setError('Password saat ini dan password baru sama.')
        }
        if(changeData.newPassword.length <= 7) {
            return setError('Password Baru Anda Terlalu Pendek.')
        }
        try {
            const response = await axios.post('/auth/editPassword', {
                email: decodedToken?.email,
                password: changeData.password,
                newPassword: changeData.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${aksesToken}`,
                }
            });
            alertsucces('Berhasil',response.data.message,'success')
            navigate('/profil');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message)
        }
    };

    return (
        <div id='transaksi-saya'>
            <Navbar />
            <div style={{ maxWidth: "30rem", margin: "3.5rem auto 2rem auto", paddingLeft: "0.2rem" }}>
                <h1 style={{ padding: "2rem 0 0.5rem 0", color: "#01426a" }}>Pengaturan Akun</h1>
                <p style={{ color: "#545454" }}>
                    Selamat datang, <span style={{ color: "black", fontWeight: "600" }}>
                        {decodedToken?.name || decodedToken?.email}
                    </span>
                </p>
                <div style={{ display: "flex", paddingTop: "2rem", gap: "1rem", alignItems: "center" }}>
                    <Link to='/profil' style={{ color: "#0088ff", textDecoration: "none" }}>Akun Anda</Link>
                    <FaChevronRight color='#545454' fill='#545454' size='0.8rem' />
                    <p style={{ color: "black" }}>Edit Password</p>
                </div>
            </div>
            <div className='container-register' style={{ margin: "1rem auto 3rem auto" }}>
                <div className='register-form'>
                    <form onSubmit={newPassword}>
                        <div className='h2'>
                            <h3 style={{ color: "black", fontSize: "1.5rem" }}>Edit Password</h3>
                        </div>
                        <div className='input'>
                            <p>Kata Sandi Saat Ini</p>
                            <div className='parent-password'>
                            <input
                                name="password"
                                type={type}
                                style={{ color: 'black' }}
                                value={changeData.password || ''}
                                onChange={handleChange}
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
                            <p>Kata Sandi Baru</p>
                            <div className='parent-password'>
                            <input
                                name="newPassword"
                                type={newtype}
                                style={{ color: 'black' }}
                                value={changeData.newPassword || ''}
                                onChange={handleChange}
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
                        <p style={{color:'red'}}>{error}</p>
                        <div className='submit'>
                            <button type='submit'>Simpan Perubahan</button>
                        </div>
                        <div className='login-submit'>
                            <p>Atau</p>
                            <Link to="/profil" className="link">Batalkan</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditPass;
