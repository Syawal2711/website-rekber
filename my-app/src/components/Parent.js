import React from 'react'
import Navbar from './Navbar.js'
import Home from './Home.js'
import Intro from './intro.js'
import Method from './Method.js'
import Method1 from './Method1.js'
import ListFee from './ListFee.js'
import Accordion from './Accordion.js'
import Choose from './Choose.js'
import Footer from './Footer.js'

const Parent = () => {
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