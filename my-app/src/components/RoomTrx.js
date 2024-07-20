import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Stepper,Step } from 'react-form-stepper'
import './RoomTrx.css';


const RoomTrx = () => {


  const {transaksiId} = useParams();
  const [transaksi,setTransaksi] = useState(null);
  const [loading,setLoading] = useState(false)
  const [steps,setSteps] = useState(null);
  const token = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(token)
  const email = decodedToken.email;
  const [buyerAgree,setBuyerAgree] = useState(false);
  const [sellerAgree,setSellerAgree] = useState(false);
  console.log(transaksi)
  

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response  = await axios.get(`/auth/transaction/${transaksiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setTransaksi(response.data);
        setSteps(response.data.step);
        setBuyerAgree(response.data.buyerAgreed);
        setSellerAgree(response.data.sellerAgreed);
      } catch (error) {
        console.log('Error:', error)
      }
    }
  if(token) {
    fetchTransaction();
  }
  }, [token,transaksiId,steps]);

  const updateState = async (field) => {
    console.log(field)
    setLoading(true);
    console.log(transaksiId)
    try {
      await axios.patch(`/auth/agreed/${transaksiId}`,{ field }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (field === 'buyerAgreed') {
        setBuyerAgree(true);
        console.log('buyerrr')
      } else if (field === 'sellerAgreed') {
        setSellerAgree(true);
        console.log('seller')
      }
      setSteps(steps + 1);
    } catch (error) {
      console.error('Error updating state:', error);
    } finally {
      setLoading(false);
    }
  };

  const agreeBuyer = () => {
    updateState('buyerAgreed');
  };

  const agreeSeller = () => {
    updateState('sellerAgreed');
  };

   const totalPembeli = () => {
        const amountValue = parseFloat(transaksi.amount);
        const adminFee = parseFloat(transaksi.admin_fee)
        
        switch (transaksi.admin_paid_by) {
            case 'Pembeli' : return amountValue + adminFee;
            case '50%/50%' : return amountValue + (adminFee / 2);
            default : return amountValue;
        }
    }

    const totalPenjual = () => {
        const amountValue = parseFloat(transaksi.amount);
        const adminFee = parseFloat(transaksi.admin_fee);
        
        switch (transaksi.admin_paid_by) {
            case 'Penjual' : return amountValue - adminFee;
            case '50%/50%' : return amountValue - (adminFee / 2);
            default : return amountValue;
        }
    }


  if(!transaksi) {
    return <div>Transaksi tidak di temukan</div>
  }
 
  return (
  <>
    <div className='container-transaksi'>
      <div className='judul'>
      <h1>{steps === 0 && (<div>Persetujuan</div>)}
      {steps === 1 && (<div>Pembayaran</div>)}
      {steps === 2 && (<div>Transaksi</div>)}
      {steps === 3 && (<div>Pencairan</div>)}
      {steps === 4 && (<div>Selesai</div>)}
      </h1>
      <p>IDtrx:{transaksi.transaction_id}</p>
      </div>
      <div className='p'>
        <p>{transaksi.buyer_email} membeli {transaksi.product} dari {transaksi.seller_email}</p>
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
      <p>Kedua belah pihak harus menyetujui transksi di bawah untuk melanjutkan transaksi</p>
    )}
    {steps === 1 && (<>
    {transaksi.beridentitas === 'Tidak' && (
      <p>Pembeli Melakukan Pembayaran Ke Syawalrekber.com Untuk Melanjutkan Transaksi</p>
    )}
    {transaksi.beridentitas === 'Ya' && (
      <p>Pembeli Melakukan Pembayaran Ke Syawalrekber.com Dan Penjual Mengiriman Identitasnya.</p>
    )}
    </>)}
    {steps === 2 && (
      <p>Pembeli dan Penjual Melakukan Tranaksi,Ketika Pembeli sudah menerima barang/jasanya haraf di konfirmasi</p>
    )}
    {steps === 3 && (
      <p>Pembayaran Ke Penjual sebesar IDR {transaksi.amount}</p>
    )}
    {steps === 4 && (
      <p>Terima kasih telah bertransaksi dengan kami</p>
    )}
    </div>
    <div className='proses'>
      {steps === 0 && (
        <>
        {transaksi.seller_email === email && (
          <div>
          <h4>Setujui Transaksi</h4>
         <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}</p>
         <div className = 'button-agree'>
          <div className='setuju'>
            {!sellerAgree && <button onClick={agreeSeller}disabled={loading} >{loading ? <div className='spinner'></div>:'Setuju'}</button>}
          </div>
          <div className='ubah'>
          <button>Ubah</button>
          </div>
         </div>
        </div>
        )}
        {transaksi.buyer_email === email && (
          <div>
            <h4>Setujui Transaksi</h4>
           <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}</p>
           <div className = 'button-agree'>
            <div className='setuju'>
              {!buyerAgree && <button onClick={agreeBuyer} disabled={loading}>{loading ? <div className='spinner'></div> : 'Setuju'}</button>}
            </div>
            <div className='ubah'>
            <button>Ubah</button>
            </div>
           </div>
          </div>
        )}
        </>
      )}
      {steps === 1 && (
        <>
        {transaksi.seller_email === email && (
          <>
          {transaksi.beridentitas === 'Tidak' && (
            <div>
              <h4>Menunggu Pembeli</h4>
              <p>Menunggu pembeli melakukan pembyaran ke Syawalrekber.com</p>
            </div>
          )}
          {transaksi.beridentitas === 'Ya' && (
            <div>
              <h4>Idenitas</h4>
              <p>Tranaksi beridentitas silahkan kirimkan identitas anda</p>
              <div className='button-payment'>
            <button>kirim</button>
          </div>
            </div>
          )}
          </>
        )}
        {transaksi.buyer_email === email && (
          <div>
            <h4>Pembayran</h4>
            <p>Silahkan lakukan pembaran ke syawalrekber.com untuk melanjutkan transaksi</p>
            <div className='button-payment'>
            <button>Bayar</button>
          </div>
          </div>
        )}
        </>
      )}
      {steps === 2 && (
        <>
        {transaksi.seller_email === email && (
          <div>
            <h4>Bertransaksi</h4>
            <p>Dana diterima,pembeli dan penjual melakukan transaksi,dan apabila pembeli telah menerima barang/jasanya kami akan otomatis melanjutkanya ke langkah pencaiaran dana ke Anda</p>
          </div>
        )}
        {transaksi.buyer_email === email && (
             <div>
             <h4>Bertransaksi</h4>
             <p>Dana diterima,pembeli dan penjual melakukan transaksi,dan apabila anda telah menerima barang/jasanya dari pembeli silahkan klik tombol dibawah untuk melakukan pencairan dana penjual </p>
             <div className='button-payment'>
              <button>Cairkan</button>
             </div>
           </div>
          )}
        </>
      )}
      {steps === 3 && (
        <>
        {transaksi.seller_email === email && (
          <div>
          <h4>Pembayaran Ke Penjual</h4>
          <p>Klick tombol di bawah ini untuk mengirimkan anda email pembayaran ke email anda sebesar IDR {transaksi.amount}</p>
          <div className='button-payment'>
            <button>Cairkan</button>
          </div>
        </div>
        )}
        {transaksi.seller_buyer === email && (
          <div>
            <h4>Pembayaran Ke Penjual</h4>
            <p>Kami sedang melakukan pencairan dana ke penjual sebesar IDR {transaksi.amount}</p>
          </div>
        )}
        </>
      )}
    </div>
    </div>
    {steps === 2 && (
      <div className='container-transaksi'>
        <div className='proses'>
      <p>Butuh ruang untuk bertransaksi dan di pantau dengan admin? anda bisa mengklick tombol dibawah untuk membuat grub whatsapp untuk bertransaksi</p>
      <div className='button-payment'>
           <button>Buat grub</button>
      </div>
      </div>
      </div>
    )}
    <div className='trx-detail'>
      <h3>Transaksi Detail</h3>
       <div className='trx'>
        <p>{transaksi.product}</p>
        <p>IDR {parseFloat(transaksi.amount)}</p>
       </div>
       <div className='trx'>
        <p>Beridentitas</p>
        <p>{transaksi.beridentitas}</p>
       </div>
       <div className='trx'>
        <p>Biaya Admin  Di Bayar <br/> {transaksi.admin_paid_by}
        </p>
        <p>IDR {parseFloat(transaksi.admin_fee)}</p>
       </div>
      <div className='trx'>
        <p>Total Harga</p>
        <p>IDR {parseFloat(transaksi.amount) + parseFloat(transaksi.admin_fee)}</p>
      </div>
      <div className= 'result'></div>
      <div className='trx'>
        <p>Harga Pembeli</p>
        <p>IDR {totalPembeli()}</p>
      </div>
      <div className='trx'>
        <p>Hasil Penjual</p>
        <p>IDR {totalPenjual()}</p>
      </div>
    </div>
    </>
  )
}

export default RoomTrx