import React from 'react';
import { Link } from 'react-scroll';
import { Link as Link1 } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <div style={{backgroundColor:'#01426a',width:'100%'}}>
        <nav className="navbar">
          <h1>Syawalrekber.com</h1>
            <div className="navbar-nav">
                <div className="nav-item">
                    <Link
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
                <div className="nav-item">
                    <Link
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
                    <Link
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
                    <Link
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
                    <Link
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
            </div>
            <div  style={{gap:'1rem'}} className='navbar-right'>
              <div className='login'>
              <Link1 to='/login' style={{textDecoration:'none'}}>Login</Link1>
              </div>
              <Link1 to='/register' style={{backgroundColor:'#3cb95d',
                padding:'8px 1.5rem',
                fontSize:'large',
                fontWeight:700,
                borderRadius:'5px',
                textDecoration:'none'
              }}>Buat Akun</Link1>      
              </div>
        </nav>
        </div>
    );
}

export default Navbar;
