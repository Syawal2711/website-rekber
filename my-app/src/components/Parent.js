import React, { useEffect } from 'react'
import Navbar from './Navbar.js'
import Home from './Home.js'
import Intro from './intro.js'
import Method from './Method.js'
import Method1 from './Method1.js'
import ListFee from './ListFee.js'
import Accordion from './Accordion.js'
import Choose from './Choose.js'
import Footer from './Footer.js'
import { useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll'

const Parent = () => {
  const location = useLocation();
  useEffect(()=> {
    if(location.hash) {
      scroller.scrollTo(location.hash.replace('#',''),{
        duration:800,
        delay:0,
        smooth:'easeInOutQuart'
      })
    }
  },[location])
  return (
    <>
    <Navbar/>
    <Home/>
    <Intro/>
    <Method/>
    <Method1/>
    <ListFee/>
    <Accordion/>
    <Choose/>
    <Footer/>
    </>
  )
}

export default Parent