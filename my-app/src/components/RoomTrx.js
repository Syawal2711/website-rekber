import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Stepper,Step } from 'react-form-stepper'
import './RoomTrx.css';


const RoomTrx = () => {


  const {transaksiId} = useParams();
  const [transaksi,setTransaksi] = useState(null);
  const [loading,setLoading] = useState(true)
  const [steps,setSteps] = useState(0);
  const token = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(token)
  const email = decodedToken.email

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response  = await axios.get(`http://192.168.57.128:3001/auth/transaction/${transaksiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setTransaksi(response.data);
        console.log(response.data);
      } catch (error) {
        console.log('Error:', error)
      }
    }
  if(token) {
    fetchTransaction();
  }
  else {
    setLoading(false)
  }
  }, [token,transaksiId]);

  if(loading) {
    return <div>Loading...</div>
  }
  if(!transaksi) {
    return <div>Transaksi tidak di temukan</div>
  }
  
  return (
  <>
    <div className='container-transaksi'>
      <div className='judul'>
      <h1>Persetujuan</h1>
      <p>IDtrx:2717hdy</p>
      </div>
      <div className='p'>
        <p>sabrijusmin5@gmail.com membeli akun game dari s19199346@gmail.com</p>
      </div>
      <div className='stepper'>
    <Stepper
      activeStep={steps}
      styleConfig={{
        activeBgColor: '#4CAF50',
        activeTextColor: '#FFFFFF',
        completedBgColor: '#01426a',
        completedTextColor: '#FFFFFF',
        inactiveBgColor: '#E0E0E0',
        inactiveTextColor: '#9E9E9E',
      }}
      connectorStyleConfig={{
        activeColor: '#4CAF50',
        completedColor: '#01426a',
        disabledColor: '#E0E0E0'
      }}
    >
      <Step label="Persetujun" />
      <Step label="Pembayaran" />
      <Step label="Tranaksi" />
      <Step label="Pencairan" />
      <Step label="Selesai" />
    </Stepper>
    {steps === 0 && (
      <p>Kedua belah pihak harus menyetujui transaksi</p>
    )}
    {steps === 1 && (
      <p>Pembeli melakukan Pembayaran sebesar Idr 1.010.000 kepada Syawalrekber.com.Dan Penjual Mengirimkan identitasnya</p>
    )}
    {steps === 2 && (
      <p>Pembeli dan Penjual Melakukan Tranaksi,Ketika Pembeli sudah menerima barang/jasanya haraf di konfirmasi</p>
    )}
    {steps === 3 && (
      <p>Pembayaran Ke Penjual sebesar IDR 1.000.000</p>
    )}
    {steps === 4 && (
      <p>Terima kasih telah bertransaksi dengan kami</p>
    )}
    </div>
    <div className='proses'>
      {steps === 0 && (
        <div>
        <h4>Setujui Transaksi</h4>
        <p>Lihat dan setujui transaksi yang di buat pada tanggal 2 maret 2024</p>
        <div className='button-agree'>
          <div className='setuju'>
          <button>Setuju</button>
          </div>
          <div className='ubah'>
          <button>Ubah</button>
          </div>
        </div>
        </div>
      )}
      {steps === 1 && (
        <div>
          <h4>Pembayaran</h4>
          <p>Silahkan lakukan pembayaran agar transaksi bisa berlanjut dengan mengklick tombol di bawah</p>
          <div className='button-payment'>
          <button>Bayar Sekarang</button>
          </div>
        </div>
      )}
      {steps === 2 && (
        <div>
          <h4>Bertransaksi</h4>
          <p>Selamat bertransaksi,Apabila Anda telah selesai klick tombol di bawah untuk meneruskan pembayaran ke penjual</p>
          <div className='button-payment'>
            <button>Selesai</button>
          </div>
        </div>
      )}
      {steps === 3 && (
        <div>
          <h4>Pembayaran Ke Penjual</h4>
          <p>Klick tombol di bawah ini untuk mengirimkan email pembayaran ke email anda sebesar IDR 1.000.000</p>
          <div className='button-payment'>
            <button>Cairkan</button>
          </div>
        </div>
      )}
    </div>
    </div>
    <div className='trx-detail'>
      <h3>Transaksi Detail</h3>
       <div className='trx'>
        <p>Akun game</p>
        <p>IDR 1.000.000</p>
       </div>
       <div className='trx'>
        <p>Beridentitas</p>
        <p>Tidak</p>
       </div>
       <div className='trx'>
        <p>Biaya Admin  Di Bayar <br/> Penjual
        </p>
        <p>IDR 10.000</p>
       </div>
      <div className='trx'>
        <p>Total Harga</p>
        <p>IDR 1.010.000</p>
      </div>
    </div>
    </>
  )
}

export default RoomTrx