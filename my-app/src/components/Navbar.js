import React, { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-scroll';
import { Link as Link1 } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

function Navbar() {
    const [menu, setMenu] = useState(false);
    const [prof, setProf] = useState(false);
    const navRef = useRef(null);
    const menuIconRef = useRef(null);
    const token = localStorage.getItem('accessToken');
    let email = '';

    if (token) {
        const decodedToken = jwtDecode(token);
        email = decodedToken.email;
    }

    const handleMenu = () => {
        setMenu(!menu);
    };

    const handleProfil = () => {
        setProf(!prof);
        if (menu) {
            setMenu(false);
        }
    };

    const handleClickluar = (e) => {
        if (navRef.current && !navRef.current.contains(e.target) &&
            menuIconRef.current && !menuIconRef.current.contains(e.target)) {
            setMenu(false);
            setProf(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickluar);
        return () => {
            document.removeEventListener('mousedown', handleClickluar);
        };
    }, []);

    const handleItemClick = () => {
        setMenu(false);
    };

    return (
        <div style={{ backgroundColor: '#01426a', width: '100%' }}>
            <nav className="navbar">
                <div>
                    <h1>Syawalrekber.com</h1>
                </div>
                <div ref={navRef} className={`navbar-nav ${menu ? 'active' : ''}`}>
                <div className="nav-item" >
                    <Link onClick={handleItemClick} 
                        activeClass="active"
                        to="home"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        Home
                    </Link>
                </div>
                <div className="nav-item" >
                    <Link onClick={handleItemClick}
                        activeClass="active"
                        to="tutorial"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}

                    >
                        Tata Cara
                    </Link>
                </div>
                <div className="nav-item">
                    <Link onClick={handleItemClick} 
                        activeClass="active"
                        to="list-fee"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        Biaya Transaksi
                    </Link>
                </div>
                <div className="nav-item">
                    <Link onClick={handleItemClick} 
                        activeClass="active"
                        to="faq"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        FAQ
                    </Link>
                </div>
                <div className="nav-item">
                    <Link onClick={handleItemClick} 
                        activeClass="active"
                        to="footer"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        Contact
                    </Link>
                </div>
                {!token && <div style={{borderTop:'1px solid #d9d9d9',width:'100%',paddingTop:'10px'}} className="nav-item menu-auth">
                    <Link1 to='/register'>
                        Buat Akun
                    </Link1>
                </div>}
                {!token && <div className="nav-item menu-auth">
                   <Link1 to='/login'>Login</Link1>
                </div>}
                {token && <div style={{borderTop:'1px solid #d9d9d9',width:'100%',paddingTop:'10px'}} className="nav-item menu-auth">
                    <Link1 to='/register'>
                        Transaksi Saya
                    </Link1>
                </div>}
                {token && <div className="nav-item menu-auth">
                   <Link1 to='/login'>Provil Saya</Link1>
                </div>}
                {token && <div className="nav-item menu-auth">
                   <Link1 to='/login'>Log out</Link1>
                </div>}
                </div>
                <div style={{ display: "flex", gap: '10px' }}>
                    <div style={{ gap: '1rem' }} className='navbar-right'>
                        {!token && <>
                            <div className='login'>
                                <Link1 to='/login' style={{ textDecoration: 'none' }}>Login</Link1>
                            </div>
                            <Link1 to='/register' style={{
                                backgroundColor: '#3cb95d',
                                padding: '8px 1.5rem',
                                fontSize: 'large',
                                fontWeight: 700,
                                borderRadius: '5px',
                                textDecoration: 'none'
                            }}>Buat Akun</Link1>
                        </>}
                        {token && <div style={{ display: 'flex', gap: '1rem', alignItems: "center" }}>
                            <Link1 to='/create-transaction' style={{
                                backgroundColor: '#3cb95d',
                                padding: '8px 1.5rem',
                                fontSize: 'large',
                                fontWeight: 700,
                                borderRadius: '5px',
                                textDecoration: 'none'
                            }}>Buat Trx</Link1>
                            <div onClick={handleProfil} ref={menuIconRef} style={{
                                borderRadius: '50%',
                                backgroundColor: '#004AAD',
                                fontSize: 'large',
                                fontWeight: '700',
                                width: '2rem',
                                height: '2rem',
                                display: 'flex',
                                textAlign: 'center',
                                alignItems: "center",
                                justifyContent: 'center',
                                lineHeight: '2rem'
                            }}>S
                            </div>
                        </div>}
                    </div>
                    <div className='menu'>
                        <MenuIcon onClick={handleMenu} style={{ alignItems: 'center', width: "2.5rem", height: 'auto' }} />
                    </div>
                    <div ref={navRef} className={`myprofil ${prof ? 'active' : ''}`}>
                        <div style={{ display: 'flex',
                            gap: "1rem",
                            padding: '0.8rem',
                            borderBottom: '1px solid #d9d9d9'
                        }}>
                            <div style={{
                                backgroundColor: '#004AAD',
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                lineHeight: '3rem',
                                fontSize: '1.5rem',
                                fontWeight: '700'
                            }}>S</div>
                            <p style={{
                                fontSize: '0.8rem',
                                color: '#545454',
                                display: 'flex',
                                alignItems: 'center'
                            }}>{email}</p>
                        </div>
                        <div className='log' style={{ borderBottom: "1px solid #d9d9d9" }}>
                            <p>Profil Saya</p>
                        </div>
                        <div className='log' style={{ borderBottom: "1px solid #d9d9d9" }}>
                            <p>Transaksi Saya</p>
                        </div>
                        <div className='log'>
                            <p>Log out</p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
