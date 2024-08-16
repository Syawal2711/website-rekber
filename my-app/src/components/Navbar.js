import React, { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-scroll';
import { Link as Link1 } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const [menu,setMenu] = useState(false);
    const navRef = useRef(null);
    const menuIconRef = useRef(null);

    const hanleMenu = () => {
        setMenu(!menu)
    }
    const handleClickluar = (e) => {
        if(navRef.current && !navRef.current.contains(e.target) && menuIconRef.current && !menuIconRef.current.contains(e.target)) {
            setMenu(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown',handleClickluar);
        return () => {
            document.removeEventListener('mousedown',handleClickluar)
        }
    },[])

    const handleItemClick = () => {
        setMenu(false);
    };

    return (
        <div style={{backgroundColor:'#01426a',width:'100%'}}>
        <nav className="navbar">
            <div>
            <h1>Syawalrekber.com</h1>
            </div>
            <div ref={navRef} className={`navbar-nav ${menu ? 'active':''}`}>
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
                <div style={{borderTop:'1px solid #545454',width:'100%',paddingTop:'10px'}} className="nav-item menu-auth">
                    <Link1 to='/register'>
                        Buat Akun
                    </Link1>
                </div>
                <div className="nav-item menu-auth">
                   <Link1 to='/login'>Login</Link1>
                </div>

            </div>
            <div style={{display:"flex",gap:'10px'}}>
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
               <div className='menu'>
               <MenuIcon  onClick={hanleMenu} ref={menuIconRef} style={{alignItems:'center',width:"2.5rem",height:'auto'}}/>
               </div>
              </div>
        </nav>

        </div>
    );
}

export default Navbar;
