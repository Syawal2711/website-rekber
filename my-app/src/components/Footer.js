import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import img from '../assets/images/8.png';

const Footer = () => {
    return (
        <div id='footer' style={{ backgroundColor: '#01426a', position: 'relative', paddingBottom: '5rem' }}>
            <div className='footer' style={{ display: 'flex', width: '60rem', margin: '0 auto', gap: '2rem', paddingTop: '11rem' }}>
                <div style={{ flex: '1' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Syawalrekber.com</h2>
                    <p style={{ fontWeight: '100', fontSize: '0.9rem', lineHeight: '20px' }}>
                        Jasa Rekening Bersama Terpercaya. Transaksi jarak jauh mudah & aman dari penipuan
                    </p>
                    <button style={{ backgroundColor: '#3cb95d', border: 'none', borderRadius: '5px', padding: '8px 1.5rem', fontSize: '1rem', fontWeight: '700', marginTop: '2rem' }}>
                        Transaksi Sekarang
                    </button>
                </div>
                <div className='footers' style={{ flex: '1' }}>
                    <p>Navigasi</p>
                    <Link className='link'>Home</Link><br />
                    <Link className='link'>Tata Cara</Link><br />
                    <Link className='link'>Biaya Transaksi</Link><br />
                    <Link className='link'>FAQ</Link>
                </div>
                <div className='footers' style={{ flex: '1' }}>
                    <p>Contact</p>
                    <Link className='link'>081524575677</Link><br />
                    <Link className='link'>089347348473</Link><br />
                    <Link className='link'>syawalrekber@gmail.com</Link>
                </div>
                <div className='footers' style={{ flex: '1' }}>
                    <p>Social</p>
                    <Link className='link'>Syawalrekber</Link><br />
                    <Link className='link'>syawal_rekber</Link>
                </div>
            </div>
            <div style={{
                backgroundColor: '#004AAD',
                width: '50rem',
                position: 'absolute',
                top: '-8rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                borderRadius:'15px'
            }}>
                <div style={{ color: 'white' }}>
                    <h1 style={{marginBottom:'2rem'}}>Mau tanya-tanya dulu ke admin? Hubungi kami di Whatsapp</h1>
                    <Link style={{ textDecoration: 'none',padding:'8px 1.5rem',borderRadius:'5px',backgroundColor:'#3cb95d',fontWeight:'600'}}>Chat Whatsapp</Link>
                </div>
                <img src={img} alt='img' style={{ width: '15rem', height: 'auto', marginLeft: '1rem' }} />
            </div>
        </div>
    );
}

export default Footer;
