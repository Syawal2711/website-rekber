import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import './register.css';
import { jwtDecode } from 'jwt-decode';
import { alertsucces } from '../all/allFunction';

const Proff = () => {
    const navigate = useNavigate();
    const aksesToken = localStorage.getItem('accessToken');
    const decodedToken = aksesToken ? jwtDecode(aksesToken) : null;
    const [changeData, setChangeData] = useState({ name: '', noHp: '' });
    const [error,setError] = useState('')

    useEffect(() => {
        if(aksesToken) {
            setChangeData({
                name:decodedToken.name,
                noHp:decodedToken.noHp
            })
        }
    
    },[aksesToken])


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'noHp') {
            if (/^\d*$/.test(value)) {
              setChangeData({
                ...changeData,
                [name]: value,
              });
            }
          } else {
            setChangeData({
              ...changeData,
              [name]: value,
            });
          }
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if((changeData.name === decodedToken.name) && (changeData.noHp === decodedToken.noHp)) {
            return setError('Tidak ada perubahan yang dilakukan.')
        }
        if(changeData.name.length > 100){
           return setError('Nama lengkap tidak boleh lebih dari 100 kata.')
        } 
        if(changeData.name.length < 3) {
           return setError('Nama terlalu pendek.')
        }
        if (
            (!/^62|08/.test(changeData.noHp)) || 
            (changeData.noHp.length < 10 || changeData.noHp.length > 13)
          ) {
            return setError('No handphone tidak valid.');
          }
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
        localStorage.setItem('accessToken',response.data.accessToken )
        alertsucces('Berhasil',response.data.message,'success')
        console.log(response)
        navigate('/profil')
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div id='transaksi-saya'>
            <Navbar />
            <div style={{ maxWidth: "30rem", margin: "3.5rem auto 2rem auto", paddingLeft: "0.2rem" }}>
                <h1 style={{ padding: "2rem 0 0.5rem", color: "#01426a" }}>Pengaturan Akun</h1>
                <p style={{ color: "#545454" }}>Selamat datang, <span style={{ color: "black", fontWeight: "600" }}>{decodedToken.name ? decodedToken.name : decodedToken.email}</span></p>
                <div style={{ display: "flex", paddingTop: "2rem", gap: "1rem", alignItems: "center" }}>
                    <Link to='/profil' style={{ color: "#0088ff", textDecoration: "none" }}>Akun Anda</Link>
                    <FaChevronRight color='#545454' fill='#545454' size='0.8rem' />
                    <p style={{ color: "black" }}>Informasi Pribadi</p>
                </div>
            </div>
            <div className='container-register' style={{ margin: "1rem auto 3rem auto", paddingTop: '2rem'}}>
                <div className='register-form'>
                    <form onSubmit={handleSubmit}>
                        <div className='input'>
                            <p>Nama Lengkap</p>
                            <input name="name"
                            style={{color:'black'}}
                            value={changeData.name || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <p>Alamat Email</p>
                            <input style={{ color: "black" }} value={decodedToken.email || ''} readOnly />
                        </div>
                        <div>
                            <p>No Handphone</p>
                            <input
                            type='text'
                             name="noHp" style={{color:'black'}} value={changeData.noHp || ''} onChange={handleChange} />
                        </div>
                        <p style={{color:"red"}}>{error}</p>
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