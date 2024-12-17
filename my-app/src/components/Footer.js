import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import img from '../assets/images/8.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <div id='footer'>
            <div className='footer'>
                <div style={{ flex: '1' }}>
                    <h2 style={{ marginBottom: '2rem' }}>SyawalRekber.com</h2>
                    <p style={{ fontWeight: '300', fontSize: '0.9rem', lineHeight: '20px' }}>
                        Jasa Rekening Bersama Terpercaya. Transaksi jarak jauh mudah & aman dari penipuan
                    </p>
                    <button style={{ backgroundColor: '#3cb95d', border: 'none', borderRadius: '5px', padding: '8px 1.5rem', fontSize: '1rem', fontWeight: '700', marginTop: '2rem' }}>
                        <Link to='/detail' style={{textDecoration:'none'}}>Transaksi Sekarang</Link>
                    </button>
                </div>
                <div className='footers' style={{ flex: '1' }}>
                    <p>Navigasi</p>
                    <Link to='/#home' className='link'>Home</Link>
                    <Link to='/#tutorial' className='link'>Tata Cara</Link>
                    <Link to='/#list-fee' className='link'>Biaya Transaksi</Link>
                    <Link to='/#faq' className='link'>FAQ</Link>
                </div>
                <div className='footers' style={{ flex: '1'}}>
                    <p>Contact</p>
                    <Link className='link'>{<WhatsAppIcon/>} 
                     081524575677</Link>
                    <Link className='link'> {<WhatsAppIcon/>}  089347348473</Link>
                    <Link className='link'>{<Email/>} syawalrekber@gmail.com</Link>
                </div>
                <div className='footers' style={{ flex: '1' }}>
                    <p>Social</p>
                    <Link className='link'>{<Facebook/>} Syawalrekber</Link>
                    <Link className='link'>{<Instagram/>} syawal_rekber</Link>
                </div>
            </div>
            <div className='footer-img'>
                <div style={{ color: 'white' }}>
                    <h1 style={{marginBottom:'2rem'}}>Mau tanya-tanya dulu ke admin? Hubungi kami di Whatsapp</h1>
                    <Link
                    to='https://wa.me/6287831531101' style={{ textDecoration: 'none',padding:'8px',borderRadius:'5px',backgroundColor:'#3cb95d',fontWeight:'600',display:'flex',alignItems:'center',gap:'0.5rem',
                    width:'12rem',
                    justifyContent:'center'
                    }}>{<WhatsAppIcon/>} Chat Whatsapp</Link>
                </div>
                <img src={img} alt='img' className='img-footer' style={{ width: '15rem', height: 'auto', marginLeft: '1rem' }} />
            </div>
        </div>
    );
}

export default Footer;
