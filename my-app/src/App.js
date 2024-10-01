import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Parent from './components/Parent';
import TransactionDetail from './components/TransactionDetail';
import Login from './auth/login';
import Register from './auth/register'
import PrivateRoute from './PrivateRoute';
import Transaksi from './components/RoomTrx'
import Instructions from './agreed/Instructions' // Pastikan path sesuai dengan lokasi PrivateRoute
import PrivacyPolice from './agreed/PrivacyPolice';
import MyTransaksi from './myprofil/mytrx'
import Aktivate from './myprofil/Aktivate';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Parent />} />
          <Route path='/login' element={<Login />} />
          <Route path='/detail' element={
            <PrivateRoute>
              <TransactionDetail/>
            </PrivateRoute>
          }/>
          <Route path='/transaksi/:transaksiId' element={
            <PrivateRoute>
              <Transaksi/>
            </PrivateRoute>
          }/>
          <Route path='/activate/:token' element={Aktivate}/>
          <Route path='/transaksisaya' element={<MyTransaksi/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='*' element={<Navigate to='/'/>}/>
          <Route path='/Intructions' element={<Instructions/>}/>
          <Route path='/privacypolice' element={<PrivacyPolice/>}/>
        </Routes>
      </>
    </Router>
  );
}

export default App;

