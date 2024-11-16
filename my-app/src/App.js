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
import Profil from './myprofil/Profil';
import ForgotPass from './auth/forgotPass';
import EditPass from './auth/EditPass';
import MyProfil from './auth/proff';
import Trylog from './myprofil/Trylog';
import ResetPass from './auth/ResetPass';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Parent />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profil/password' element={<EditPass/>}/>
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
          <Route path='/profil' element={<Profil/>}/>
          <Route path='/profil/myprofil' element={<MyProfil/>}/>
          <Route path='/activate/:token' element={<Aktivate/>}/>
          <Route path='/reset/password/:token' element={<ResetPass/>}/>
          <Route path='/trylog/:id/:token' element={<Trylog/>}/>
          <Route path='/transaksisaya' element={<MyTransaksi/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/forgot/password' element={<ForgotPass/>}/>
          <Route path='*' element={<Navigate to='/'/>}/>
          <Route path='/Intructions' element={<Instructions/>}/>
          <Route path='/privacypolice' element={<PrivacyPolice/>}/>
        </Routes>
      </>
    </Router>
  );
}

export default App;

