import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import './register.css';
import { jwtDecode } from 'jwt-decode';

const Proff = () => {
    const navigate = useNavigate();
    const aksesToken = localStorage.getItem('accessToken');
    const decodedToken = aksesToken ? jwtDecode(aksesToken) : null;
    const [changeData, setChangeData] = useState({ name: '', noHp: '' });

    useEffect(() => {
        const myprofil = async () => {
            try {
                const response = await axios.get(`/auth/myprofil?email=${decodedToken.email}`, {
                    headers: {
                        'Authorization': `Bearer ${aksesToken}`,
                    },
                });
                setChangeData(response.data.message);
            } catch (error) {
                console.log(error);
            }
        };
        myprofil();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangeData({
            ...changeData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch('/auth/myChangProfil', {
                email: decodedToken.email,
                name: changeData.name,
                noHp: changeData.noHp,
            }, {
                headers: {
                    'Authorization': `Bearer ${aksesToken}`,
                },
            });
            navigate('/profil');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div id='transaksi-saya'>
            <Navbar />
            <div style={{ maxWidth: "30rem", margin: "3.5rem auto 2rem auto", paddingLeft: "0.2rem" }}>
                <h1 style={{ padding: "2rem 0 0.5rem", color: "#01426a" }}>Pengaturan Akun</h1>
                <p style={{ color: "#545454" }}>Selamat datang, <span style={{ color: "black", fontWeight: "600" }}>{decodedToken.name}</span></p>
                <div style={{ display: "flex", paddingTop: "2rem", gap: "1rem", alignItems: "center" }}>
                    <Link to='/profil' style={{ color: "#0088ff", textDecoration: "none" }}>Akun Anda</Link>
                    <FaChevronRight color='#545454' fill='#545454' size='0.8rem' />
                    <p style={{ color: "black" }}>Informasi Pribadi</p>
                </div>
            </div>
            <div className='container-register' style={{ margin: "1rem auto", paddingTop: '2rem' }}>
                <div className='register-form'>
                    <form onSubmit={handleSubmit}>
                        <div className='input'>
                            <p>Nama Lengkap</p>
                            <input name="name" value={changeData.name || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <p>Alamat Email</p>
                            <input style={{ color: "black" }} value={decodedToken.email || ''} readOnly />
                        </div>
                        <div>
                            <p>No Handphone</p>
                            <input
                            type='number'
                             name="noHp" value={changeData.noHp || ''} onChange={handleChange} />
                        </div>
                        <div className='submit'>
                            <button type='submit'>Simpan Perubahan</button>
                        </div>
                        <div className='login-submit'>
                            <p>Atau</p>
                            <Link to='/profil' className='link'>Batalkan</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Proff;