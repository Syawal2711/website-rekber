import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Parent from './components/Parent';
import TransactionDetail from './components/TransactionDetail';
import Login from './auth/login';
import Register from './auth/register'
import PrivateRoute from './PrivateRoute';
import Transaksi from './components/RoomTrx' // Pastikan path sesuai dengan lokasi PrivateRoute

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
          <Route path='/transaksi/:transaksiId' element={<Transaksi/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='*' element={<Navigate to='/login'/>}/>
        </Routes>
      </>
    </Router>
  );
}

export default App;

