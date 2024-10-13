import React, { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

function Navbar() {
    const [menu, setMenu] = useState(false);
    const [prof, setProf] = useState(false);
    const navRef = useRef(null);
    const menuIconRef = useRef(null);
    const token = localStorage.getItem('accessToken');
    
    let decodedToken = null;
    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    const email = decodedToken ? decodedToken.email : null;

    const checkAndRemoveToken = () => {
        if (decodedToken && decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('accessToken');
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        checkAndRemoveToken();
    }, []);

    const handleMenu = () => {
        setMenu(prevMenu => !prevMenu);
    };

    const handleProfil = () => {
        setProf(prevProf => !prevProf);
    };

    const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target) &&
            menuIconRef.current && !menuIconRef.current.contains(e.target)) {
            setProf(false);
            setMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = () => {
        setMenu(false);
    };

    const handleClearToken = () => {
        localStorage.removeItem('accessToken');
        setProf(false);
        setMenu(false);
    };

    return (
        <div style={{ backgroundColor: '#01426a', width: '100%' }}>
            <nav className="navbar">
                <div className="title">
                    <h1>SyawalRekber.com</h1>
                </div>
                <div ref={navRef} className={`navbar-nav ${menu ? 'active' : ''}`}>
                    <div className="nav-item">
                        <Link to="/#home" onClick={handleItemClick}>Home</Link>
                    </div>
                    <div className="nav-item">
                        <Link to="/#tutorial" onClick={handleItemClick}>Tata Cara</Link>
                    </div>
                    <div className="nav-item">
                        <Link to="/#list-fee" onClick={handleItemClick}>Biaya Transaksi</Link>
                    </div>
                    <div className="nav-item">
                        <Link to="/#faq" onClick={handleItemClick}>FAQ</Link>
                    </div>
                    <div className="nav-item">
                        <Link to="/#footer" onClick={handleItemClick}>Contact</Link>
                    </div>
                    {!token ? (
                        <div className='line-navbar'>
                            <div style={{ paddingTop: '15px' }} className="nav-item menu-auth">
                                <Link to='/register'>Buat Akun</Link>
                            </div>
                            <div className="nav-item menu-auth">
                                <Link to='/login'>Login</Link>
                            </div>
                        </div>
                    ) : (
                        <div className='line-navbar'>
                            <div style={{ paddingTop: '15px' }} className="nav-item menu-auth">
                                <Link to='/detail'>Buat Transaksi</Link>
                            </div>
                            <div className="nav-item menu-auth">
                                <Link to='/transaksisaya'>Transaksi Saya</Link>
                            </div>
                            <div className="nav-item menu-auth">
                                <Link to='/' onClick={handleClearToken}>Log out</Link>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: '10px' }}>
                    <div className='navbar-right'>
                        {!token ? (
                            <div style={{ gap: '1rem', display: 'flex', alignItems: 'center' }}>
                                <div className='login'>
                                    <Link to='/login' style={{ textDecoration: 'none' }}>Login</Link>
                                </div>
                                <Link to='/register' style={{
                                    backgroundColor: '#3cb95d',
                                    padding: '8px 1.5rem',
                                    fontSize: 'large',
                                    fontWeight: 700,
                                    borderRadius: '5px',
                                    textDecoration: 'none'
                                }}>Buat Akun</Link>
                            </div>
                        ) : (
                            <div className="createtrx">
                                <Link to='/detail' style={{
                                    backgroundColor: '#3cb95d',
                                    padding: '8px 1.5rem',
                                    fontSize: 'large',
                                    fontWeight: 700,
                                    borderRadius: '5px',
                                    textDecoration: 'none'
                                }}>Buat Trx</Link>
                                <div ref={menuIconRef} onClick={handleProfil} style={{
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
                                    lineHeight: '2rem',
                                    cursor: 'pointer'
                                }}>
                                    {email ? email.charAt(0).toUpperCase() : ''}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='menu'>
                        <MenuIcon ref={menuIconRef} onClick={handleMenu} style={{ alignItems: 'center', width: "2.5rem", height: 'auto' }} />
                    </div>
                    {prof && (
                        <div ref={navRef} className={`myprofil active`}>
                            <div style={{
                                display: 'flex',
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
                                }}>
                                    {email ? email.charAt(0).toUpperCase() : ''}
                                </div>
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#545454',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>{email}</p>
                            </div>
                            <div className='log' style={{ borderBottom: "1px solid #d9d9d9" }}>
                                <Link to='/detail'>Buat Transaksi</Link>
                            </div>
                            <div className='log' style={{ borderBottom: "1px solid #d9d9d9" }}>
                                <Link to='/transaksisaya'>Transaksi Saya</Link>
                            </div>
                            <div className='log'>
                                <Link to='/' onClick={handleClearToken}>Log Out</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
