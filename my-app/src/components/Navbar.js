import React from 'react';
import { Link } from 'react-scroll';
import './Navbar.css'

function Navbar() {
    return (
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
                        to="about"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        About
                    </Link>
                </div>
                <div className="nav-item">
                    <Link
                        activeClass="active"
                        to="services"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        Services
                    </Link>
                </div>
                <div className="nav-item">
                    <Link
                        activeClass="active"
                        to="contact"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                        Contact
                    </Link>
                </div>
            </div>
            <div className='navbar-right'>
              <div className='login'>
              <Link to='/login'>Login</Link>
              </div>      
              </div>
        </nav>
    );
}

export default Navbar;
