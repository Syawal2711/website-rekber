import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Stepper,Step } from 'react-form-stepper';
import './RoomTrx.css';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';



const RoomTrx = () => {


  const {transaksiId} = useParams();
  const [transaksi,setTransaksi] = useState(null);
  const [status,setStatus] = useState(null)
  const [loading,setLoading] = useState(false)
  const [steps,setSteps] = useState(0);
  const token = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(token)
  const email = decodedToken.email;
  const [buyerAgree,setBuyerAgree] = useState(0);
  const [sellerAgree,setSellerAgree] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [changeData,setChangeData] = useState({adminFee:'',
    amount:'',
    identitas:'',
    alasan:''
  })
  const [id,setId] = useState('')
  const [files,setFiles] = useState([]);
  const [files1,setFiles1] = useState([])

  console.log(status)
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
  }, [token,transaksiId]);

  useEffect(() => {
    const invoiceStatus = async () => {
      if(transaksi && transaksi.id_invoice && transaksi.step === 1) {
        try {
          const response = await axios.get('/auth/findInvoice',{
            params: { id: transaksi.id_invoice }
          })
          
          setStatus(response.data);
          if(response.data === 'PAID' && transaksi.beridentitas
 === 'Tidak') {
  updateSteps()
          }
        }
        catch (error) {
          console.error('Error:',error)
        }
      }}
        invoiceStatus();
  },[transaksi]);
  
  const updateState = async (field) => {
    setLoading(true);
    try {
      await axios.patch(`/auth/agreed/${transaksiId}`,{ field }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(field === 'buyerAgreed') {
        setBuyerAgree(1)
      }
      if (field === 'sellerAgreed') {
        setSellerAgree(1);
        }
      setLoading(false)
    } catch (error) {
      console.error('Error updating state:', error);
    } 
  };

 useEffect(() => {
    if(buyerAgree && sellerAgree && steps === 0) {
      updateSteps();
  }
},[buyerAgree,sellerAgree,steps])

  const updateSteps = async() => {
      try {
          const NewStep = steps + 1;
        await axios.patch(`/auth/updateState/${transaksiId}`, {step : NewStep}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSteps(NewStep)
      } catch (error) {
        console.log('Error:',error)
      }
  }

  const handleChangeIdentity = (e) => {
    // Mengonversi FileList menjadi array
    setFiles(Array.from(e.target.files));
  };

  const handleChangeIdentity1 = (e) => {
    // Mengonversi FileList menjadi array
    setFiles1(Array.from(e.target.files));
  };

  const handleIdentity = async(e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();

    // Menambahkan file ke FormData jika ada file
      files.forEach((file) => {
        formData.append('files', file);
      });
      files1.forEach((file) => {
        formData.append('files1',file);
      })
      formData.append('filesId',transaksiId)
      try {
        // Mengirim data menggunakan Axios
        const response = await axios.post('/auth/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false)
      } catch (error) {
        console.error('An error occurred:', error);
      }
  };
  const handleSubmit = async(e,field,fields) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/auth/change/${transaksiId}`, {
        beridentitas : changeData.identitas,
        admin_paid_by : changeData.adminFee,
        amount : changeData.amount,
        alasan : changeData.alasan,
        field,
        fields
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log('Error:',error)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('/auth/invoice',{
        id:transaksiId,
        amount: transaksi.amount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      window.location.href = response.data;
      setId(response.data.id);
      setLoading(false)
    } catch (error) {
      console.log('Error:',error)
    }
  }

  const handlePayout = async(e) => {
    setLoading(true)
    try {
      const response = await axios.post('/auth/payout', {
        external_id:transaksi.transaction_id,
        amount:transaksi.amount,
        email:transaksi.seller_email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      updateSteps();
      setLoading(false)
    } catch (error) {
      console.log('Error:',error)
    }
  }

  const handleChange = (e) => {
    const {name,value} = e.target;
    setChangeData({
      ...changeData,
      [name]: value
  })
  }

  const handleUrlPay = () => {
    window.location.href = transaksi.url_invoice
  }


  const agreeBuyer = () => {
    updateState('buyerAgreed');
  };

  const agreeSeller = () => {
    updateState('sellerAgreed');
  };

  const changeBuyer = () => {
    handleSubmit('sellerAgreed','buyerAgreed')
  }

  const changeSeller = () => {
    handleSubmit('buyerAgreed','sellerAgreed')
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25rem',
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
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
      <Step label="Persetujuan" />
      <Step label="Pembayaran" />
      <Step label="Tranaksi" />
      <Step label="Pencairan" />
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
    </div>
    <div className='proses'>
      {steps === 0 && (
        <>
        {transaksi.buyer_email === email && (
          <div>
            <h4>Setujui Transaksi</h4>
            {buyerAgree && <p>Anda sudah meneyetujui transaksi ini menunggu persetujuan dari pihak pembeli</p>}
            {!buyerAgree && <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}.Apabila anda telah setuju anda sudah tidak bisa lagi mengubah transaksi kecuali penjual mengubah transaksi lagi.</p>}
           <div className = 'button-agree'>
            <div className='setuju'>
            {!buyerAgree && <button onClick={agreeBuyer}disabled={loading} >{loading ? <div className='spinner'></div>:'Setuju'}</button>}
            </div>
            <div className='ubah'>
            {!buyerAgree && <button onClick={handleOpen}>Ubah</button>}
            <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className='modals'>
            <h4 style={{color:'#01426a', marginBottom:'1rem'}}>Ubah  ketentuan tranaksi anda</h4>
            <p style={{color: '#545454',fontSize:'1rem',marginBottom:'1rem'}}>Setelah konfirmasi, kami akan memberitahu penjual untuk meninjau pembaruan yang telah Anda buat</p>
            <div className='modal-change'>
              <form onSubmit={handleSubmit}>
              <div>
                <p>Pembayar biaya admin</p>
                <select name='adminFee' value={changeData.adminFee} onChange={handleChange}>
                  <option value='Penjual'>Penjual</option>
                  <option value='Pembeli'>Pembeli</option>
                </select>
              </div>
              <div>
                <p>Harga</p>
                <input type='number' name='amount' value={changeData.amount} onChange={handleChange} placeholder='Harga Produk/Jasa'/>
              </div>
              <div>
                <p>Beridentitas</p>
                <select name='identitas' value={changeData.identitas} onChange={handleChange}>
                  <option value='Ya'>Ya</option>
                  <option value='Tidak'>Tidak</option>
                </select>
              </div>
              <div>
                <p>Alasan</p>
                <input type='text' name='alasan' value={changeData.alasan} onChange={handleChange} placeholder='Alasan modifkasi'/>
              </div>
              <button type='submit' onClick={handleClose} disabled={loading} >{loading ? <div className='spinner'></div> : 'Konfirmasi'}</button>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
            </div>
           </div>
          </div>
        )}
        {transaksi.seller_email === email && (
          <div>
          <h4>Setujui Transaksi</h4>
          {sellerAgree && <p>Anda sudah meneyetujui transaksi ini menunggu persetujuan dari pihak Pembeli</p>}
          {!sellerAgree && <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}.Apabila anda telah setuju anda sudah tidak bisa lagi mengubah transaksi kecuali Pembeli mengubah transaksi lagi.</p>}
         <div className = 'button-agree'>
          <div className='setuju'>
            {!sellerAgree && <button onClick={agreeSeller}disabled={loading} >{loading ? <div className='spinner'></div>:'Setuju'}</button>}
          </div>
          <div className='ubah'>
            {!sellerAgree && <button onClick={handleOpen}>Ubah</button>}
            <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className='modals'>
            <h4 style={{color:'#01426a', marginBottom:'1rem'}}>Ubah  ketentuan tranaksi anda</h4>
            <p style={{color: '#545454',fontSize:'1rem',marginBottom:'1rem'}}>Setelah konfirmasi, kami akan memberitahu pembeli untuk meninjau pembaruan yang telah Anda buat</p>
            <div className='modal-change'>
              <form onSubmit={handleSubmit}>
              <div>
                <p>Pembayar biaya admin</p>
                <select name='adminFee' value={changeData.adminFee} onChange={handleChange}>
                  <option value='Penjual'>Penjual</option>
                  <option value='Pembeli'>Pembeli</option>
                </select>
              </div>
              <div>
                <p>Harga</p>
                <input type='number' name='amount' value={changeData.amount} onChange={handleChange} placeholder='Harga Produk/Jasa'/>
              </div>
              <div>
                <p>Beridentitas</p>
                <select name='identitas' value={changeData.identitas} onChange={handleChange}>
                  <option value='Ya'>Ya</option>
                  <option value='Tidak'>Tidak</option>
                </select>
              </div>
              <div>
                <p>Alasan</p>
                <input type='text' name='alasan' value={changeData.alasan} onChange={handleChange} placeholder='Alasan modifkasi'/>
              </div>
              <button type='submit' onClick={handleClose} disabled={loading} >{loading ? <div className='spinner'></div> : 'Konfirmasi'}</button>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
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
              <h4>Transaksi Beridentitas</h4>
              <div className='step-identy'>
            <p>1.Anda harus mengirimkan 2 Identitas yang menunjukkan alamat Anda</p>
            <p>2.Masukkan masing-masing 3 foto pada setiap identitas yang berupa(foto identitas,foto anda,dan foto selfi dengan identitas) </p>
            <p>3.Identitas harus jelas apabila identitas kurang jelas kami akan menyuruh anda mengirim ulang identitas yang lebih baik.
            </p>
            </div>
              <div className='button-payment'>
            <button onClick={handleOpen}>kirim</button>
            <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className='container-identity'>
            <h4 style={{color:'#01426a',marginBottom:'0.5rem'}}>Kirimkan 2 Identitas anda</h4>
            <p style={{marginBottom:'2rem'}}>Kirimkan masing-masing 3 foto(Foto identitas,foto anda,dan foto selfi dengan identitas)</p>
            <form onSubmit={handleIdentity}>
             <p>Identitas Pertama</p><br/> 
            <input type='file' name='identy1' accept='image/*' onChange={handleChangeIdentity} multiple></input>
            <p>Identitas Pertama</p><br/> 
            <input type='file' name='identy2' accept='image/*' onChange={handleChangeIdentity1} multiple></input>

            <br/>
            <button type='submit' onClick={handleClose} disabled={loading}>{loading ? <div className='spinner'></div>:'Kirim Identitas'}</button>
            </form>
            </div>
          </Box>
        </Fade>
      </Modal>
          </div>
            </div>
          )}
          </>
        )}
        {transaksi.buyer_email === email && (
          <div>
            <h4>Pembayaran</h4>
            {(status === 'PENDING' || status === null) && <p>Silahkan lakukan pembayaran ke syawalrekber.com untuk melanjutkan transaksi anda dengan mengklick tombol di bawah</p>}
            {status === 'PAID' && <p>Dana diterima menunggu pembeli selesai mengirimkan Identitasnya</p>}
            <div className='button-payment'>
              {!transaksi.id_invoice &&  <button onClick={handlePayment} disabled={loading}>{loading ? <div className='spinner'></div>:'Bayar Sekarang'}</button>}
              {transaksi.url_invoice && status === 'PENDING' && <button onClick={handleUrlPay}>Bayar Sekarang</button>}
          </div>
          </div>
        )}
        </>
      )}
      {steps === 2 && (
        <>
        {transaksi.buyer_email === email && (
          <div>
            <h4>Bertransaksi</h4>
            <p>Dana diterima,silahkan lakukan transaksi ke penjual,dan apabila anda telah menerima barang/jasanya dari pembeli silahkan klik tombol dibawah untuk mencairkan dana ke penjual </p>
            <div className='button-payment'>
              <button onClick={handlePayout} disabled={loading}>Barang diterima</button>
             </div>
          </div>
        )}
        {transaksi.seller_email === email && (
             <div>
             <h4>Bertransaksi</h4>
             <p>Dana diterima dari pembeli,silahkan lakukan transaksi ke pembeli,dan apabila pembeli sudah mengkonfirmasi bahwa barang/jasanya sudah di terimah kami akan mengirimkan pembayaran ke email anda.
             </p>
           </div>
          )}
        </>
      )}
      {steps === 3 && (
        <>
        {transaksi.seller_email === email && (
          <div>
            <h4>Pembayaran</h4>
            <p>terima Kasih telah melakukan transaksi di syawalrekber.com,kami telah mengirimkan anda email email pembayaran ke email anda</p>
          </div>
        )}
        {transaksi.buyer_email === email && (
          <div>
            <h4>Pembayaran</h4>
            <p>Terima Kasih telah melakukan transaksi di syawalrekber.com,kami telah mengirimkan email pembyaran ke penjual</p>
          </div>
        ) }
        </>
      )}
    </div>
    </div>
    <div className='trx-detail'>
      <h3>Transaksi Detail</h3>
      <div className='trx'>
        <p>Barang/Jasa</p>
        <p>{transaksi.product}</p>
       </div>
       <div className='trx'>
        <p>Harga</p>
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

export default RoomTrx;