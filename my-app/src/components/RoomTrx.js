import React, { useState, useEffect } from 'react';
import { useParams,useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Stepper,Step } from 'react-form-stepper';
import './RoomTrx.css';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Navbar from './Navbar';
import Footer from './Footer';
import '../myprofil/mytrx.css';
import { formatRupiah,calculateAdminFee } from '../all/allFunction';


const RoomTrx = () => {


  const {transaksiId} = useParams();
  const navigate = useNavigate();
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
  const [changeData,setChangeData] = useState({
    amount:'',
    admin_fee:'',
    adminFee:'',
    identitas:'',
    alasan:''
  })

  const [id,setId] = useState('')

  useEffect(() => {
    if(transaksi && transaksi.step === 0) {
        setChangeData({
          amount: parseFloat(transaksi.amount),
          admin_fee: '',
          adminFee: transaksi.admin_paid_by,
          identitas: transaksi.beridentitas,
          alasan: ''
        });
    }
  }, [transaksi]);



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
        console.error(error)
        setTimeout(() => {
          navigate('/')
        }, 5000);
      }
    }
  if(token) {
    fetchTransaction();
  }
  }, [token,transaksiId]);

  const invoiceSucces = async () => {
    try {
      await axios.patch('/auth/invoiceSucces',{
        id:transaksi.transaction_id
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const invoiceStatus = async () => {
      if(transaksi && transaksi.id_invoice && transaksi.step === 1) {
        try {
          const response = await axios.get('/auth/findInvoice',{
            params: { id: transaksi.id_invoice }
          })
          
          setStatus(response.data);
          if((response.data === 'PAID' || response.data === 'SETTLED') && transaksi.beridentitas
 === 'Tidak') {
  updateSteps()
  invoiceSucces()
          }
          if((response.data === 'PAID' || response.data === 'SETTLED') && transaksi.beridentitas
          === 'Ya' && transaksi.Payment === 'Pending') {
           invoiceSucces()
          }
        }
        catch (error) {
          console.error('Error:',error)
        }
      }}
        invoiceStatus();
  },[transaksi]);

  
  useEffect(() => {
    const payoutStatus = async () => {
      if(transaksi && transaksi.id_payout && transaksi.step === 3) {
        try {
          const response = await axios.get('/auth/findPayout', {
            params: {
              id : transaksi.id_payout
            }
          })
          if(response.data === 'COMPLETED') {
            updateSteps()
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }
    payoutStatus()
  },[transaksi])
  
  useEffect(()=> {
    const identyStatus = async() => {
      if(transaksi && transaksi.beridentitas === 'Ya' && transaksi.step === 1 && transaksi.identy &&( status === 'PAID' || status === 'SETTLED')) {
        updateSteps()
      }
    }
    identyStatus()
  },[transaksi,status])


 

  
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


useEffect(() => {
  if( transaksi && transaksi.step === 0) {
    const amountValue = parseFloat(changeData.amount);
    const newAdminFee = calculateAdminFee(amountValue);

  setChangeData(prevState => ({
    ...prevState,
    admin_fee: newAdminFee
  }));
  }
}, [transaksi,changeData.amount]); 

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


  const identy = () => {
    window.location.href = `https://wa.me/6287831531101?text=Identitas+saya+sebagai+penjual+pada+transaksi+dengan+id+*${transaksi.transaction_id}*`
  
  }
  const handleSubmit = async(field,fields,fieldss) => {
    if ((parseFloat(transaksi.amount) === changeData.amount) && 
    (transaksi.admin_paid_by === changeData.adminFee) && 
    (transaksi.beridentitas === changeData.identitas)) {
    return
    }
    let email1,email2
    if (field === 'sellerAgreed') {
      email2 = transaksi.buyer_email;
      email1 = transaksi.seller_email;
    } else {
      email2 = transaksi.seller_email;
      email1 = transaksi.buyer_email;
    }
    try {
      await axios.patch(`/auth/change/${transaksiId}`, {
        beridentitas : changeData.identitas,
        admin_paid_by : changeData.adminFee,
        amount : changeData.amount,
        alasan : changeData.alasan,
        field,
        fields,
        admin_fee: changeData.admin_fee,
        email: email1,
        email1:email2,
        changer:fieldss
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log('Error:',error)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/auth/invoice',{
        id:transaksiId,
        amount: totalPembeli(),
        name:`Rekber ${transaksi.product}`

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

  const handlePayout = async() => {
    setLoading(true)
    try {
        await axios.post('/auth/payout', {
        external_id:transaksi.transaction_id,
        amount:totalPenjual(),
        email:transaksi.seller_email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      updateSteps();
      setLoading(false)
    } catch (error) {
      navigate('/login')
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
    handleSubmit('sellerAgreed','buyerAgreed','Pembeli')
  }

  const changeSeller = () => {
    handleSubmit('buyerAgreed','sellerAgreed','Penjual')
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

  

  return (
   <>
   {transaksi && (email === transaksi.seller_email || email === transaksi.buyer_email)?(
  <div id='transaksi-saya'>
    <Navbar/>
    <div  className='note' >
      Apabila Anda Butuh Bantuan Dengan Transaksi Anda Silahkan Hubungi Kami !!
    </div>
    <div className='container-transaksi' style={{marginTop:"10rem"}}>
      <div className='judul'>
      <h1>{steps === 0 && (<div>Persetujuan</div>)}
      {steps === 1 && (<div>Pembayaran</div>)}
      {steps === 2 && (<div>Bertransaksi</div>)}
      {steps === 3 && (<div>Pencairan</div>)}
      {steps === 4 && (<div>Transaksi Selesai</div>)}
      {steps === 5 && (<div>Transaksi Batal</div>)}
      </h1>
      <p>ID:{transaksi.transaction_id}</p>
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
      <Step label="Transaksi" />
      <Step label={steps === 5 ? "Dibatalkan" : "Pencairan"} />
    </Stepper>
    { steps === 0 && (
      <p>Kedua belah pihak harus menyetujui transksi di bawah ini untuk melanjutkan transaksi.</p>
    )}
    {steps === 1 && (<>
    {transaksi.beridentitas === 'Tidak' && (
      <p>Pembeli Melakukan Pembayaran Ke SyawalRekber.com Untuk Melanjutkan Transaksi</p>
    )}
    {transaksi.beridentitas === 'Ya' && (
      <p>Pembeli Melakukan Pembayaran Ke SyawalRekber.com Dan Penjual Mengirimkan Identitasnya.</p>
    )}
    </>)}
    {steps === 2 && (
      <>
      {transaksi.beridentitas === 'Tidak' && (
         <p>Dana diterima,Silahkan lakukan transaksi Anda</p>
      )}
      {transaksi.beridentitas === 'Ya' && (
       <p>Dana diterima dan identitas penjual telah diverifikasi. Silakan lakukan transaksi Anda.</p> 
      )}
      </>
    )}
    {steps === 3 && (
      <p>Pembayaran Ke Penjual sebesar {formatRupiah(totalPenjual())}</p>
    )}
    {steps === 4 && (
      <p>Terimah kasih telah menggunakan layanan rekber kami</p>
    )}
    {steps === 5 && (<div>Transaksi Anda Di Batalkan</div>)}
    </div>
    <div className='proses'>
      {steps === 0 && (
        <>
        {transaksi.buyer_email === email && (
          <div>
            <h4>Setujui Transaksi</h4>
            {buyerAgree && <p>Anda sudah meneyetujui transaksi ini menunggu persetujuan dari pihak pembeli</p>}
            {!buyerAgree && <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}.Jika anda telah setuju,Anda sudah tidak bisa lagi mengubah transaksi kecuali penjual mengubah transaksi lagi.</p>}
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
            <p style={{color: '#545454',fontSize:'1rem',marginBottom:'1rem'}}>Setelah konfirmasi, kami akan memberitahu Penjual untuk meninjau pembaruan yang telah Anda buat</p>
            <div className='modal-change'>
              <form onSubmit={changeBuyer}>
              <div>
                <p>Pembayar biaya admin</p>
                <select name='adminFee' value={changeData.adminFee} onChange={handleChange}>
                  <option value='Penjual'>Penjual</option>
                  <option value='Pembeli'>Pembeli</option>
                  <option value='50%/50%'>50%/50%</option>
                </select>
              </div>
              <div>
                <p>Harga</p>
                <input type='number' name='amount' value={changeData.amount} onChange={handleChange} placeholder='Harga Produk/Jasa'/>
              </div>
              <div>
                <p>Biaya Transaksi</p>
                <input type='number' name='adminfee' value={changeData.admin_fee} onChange={handleChange}
                readOnly 
                />
              </div>
              <div>
                <p>Bergaransi</p>
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
          {!sellerAgree && <p>Lihat dan setujui transaksi yang di buat pada {transaksi.created_at.substring(0,10)}.Jika anda telah setuju,Anda sudah tidak bisa lagi mengubah transaksi kecuali Pembeli mengubah transaksi lagi.</p>}
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
            <h4 style={{color:'#01426a', marginBottom:'1rem'}}>Ubah  ketentuan Tranaksi Anda</h4>
            <p style={{color: '#545454',fontSize:'1rem',marginBottom:'1rem'}}>Setelah konfirmasi, kami akan memberitahu pembeli untuk meninjau pembaruan yang telah Anda buat</p>
            <div className='modal-change'>
              <form onSubmit={changeSeller}>
              <div>
                <p>Pembayar biaya admin</p>
                <select name='adminFee' value={changeData.adminFee} onChange={handleChange}>
                  <option value='Penjual'>Penjual</option>
                  <option value='Pembeli'>Pembeli</option>
                  <option value='50%/50%'>50%/50%</option>
                </select>
              </div>
              <div>
                <p>Harga</p>
                <input type='number' name='amount' value={changeData.amount} onChange={handleChange} placeholder='Harga Produk/Jasa'/>
              </div>
              <div>
                <p>Biaya Transaksi</p>
                <input type='number' name='adminfee' value={changeData.admin_fee} onChange={handleChange}
                readOnly 
                />
              </div>
              <div>
                <p>Bergaransi</p>
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
              <p>Menunggu pembeli melakukan pembayaran ke Syawalrekber.com</p>
            </div>
          )}
          {transaksi.beridentitas === 'Ya' && (
            <div>
              <h4>Transaksi Bergaransi</h4>
              <div className='step-identy'>
            <p>1. Transaksi Bergaransi. Anda dimohon untuk mengirimkan 2 identitas yang menunjukkan alamat Anda ke WhatsApp kami.</p>
            <p>2. Identitas harus jelas. Jika identitas yang dikirim kurang jelas, kami akan meminta Anda untuk mengirim ulang dengan kualitas yang lebih baik.
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
            <p style={{marginBottom:'10px'}}>Silakan pilih dua identitas yang menunjukkan alamat Anda. Sertakan foto identitas dan ambil juga foto selfie sambil memegang identitas tersebut.</p>
            <p style={{marginBottom:'2rem'}}>Tuliskan nama Anda, nama SyawalRekber.com, serta tanggal dan waktu saat ini pada selembar kertas. Kemudian, ambil foto sambil memegang kertas tersebut.</p>
            <button onClick={identy}>Kirim Identitas</button>
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
            {(status === 'PENDING' || status === null) && <p>Silakan lakukan pembayaran ke SyawalRekber.com untuk melanjutkan transaksi Anda dengan mengklik tombol di bawah.</p>}
            {(status === 'PAID' || status ===  'SETTLED') && <p>Dana telah diterima. Menunggu pembeli untuk mengirimkan identitasnya kepada admin kami.</p>}
            <div className='button-payment'>
              {(!transaksi.id_invoice || null) &&  <button onClick={handlePayment} disabled={loading}>{loading ? <div className='spinner'></div>:'Bayar Sekarang'}</button>}
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
            <p>Silahkan lakukan transaksi anda ke penjual,dan apabila anda telah menerima barang/jasa dari Penjual silahkan klik tombol dibawah untuk mencairkan dana ke penjual </p>
            <p></p>
            <div className='button-payment'>
              <button onClick={handleOpen} disabled={loading}>Barang diterima</button>
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
          <Box sx={style} className='modal-change'>
            <h4 style={{color:'#01426a',marginBottom:'1rem'}}>Pembayaran ke penjual</h4>
            <p style={{color:'#545454',fontSize:'1rem',marginBottom:'1rem'}}>Apakah anda telah menerima barang/jasa dari penjual? jika sudah harap konfirmasi agar kami bisa melakukan pencairan dana ke penjual</p>
            <button onClick={handlePayout} disabled={loading}>{loading ?<div className='spinner'></div>: 'Barang Diterima'}</button>
          </Box>
        </Fade>
      </Modal>
             </div>
          </div>
        )}
        {transaksi.seller_email === email && (
             <div>
             <h4>Bertransaksi</h4>
             <p>Silahkan lakukan transaksi Anda ke Pembeli,dan apabila Pembeli telah mengkonfirmasi terima barang/jasa dari Anda, kami akan mengirimkan email pembayaran ke alamat email Anda.
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
            <p>Terima kasih telah melakukan transaksi Anda di SyawalRekber.com. Kami telah mengirimkan pembayaran ke alamat email Anda.</p>
      
          </div>
        )}
        {transaksi.buyer_email === email && (
          <div>
            <h4>Pembayaran</h4>
            <p>Terima kasih telah melakukan transaksi Anda di SyawalRekber.com. Kami telah mengirimkan email pembayaran kepada penjual.</p>
          </div>
        ) }
        </>
      )}
      {steps === 4 && (<>
        <h4>Transaksi Selesai</h4>
        <p>Transaksi Anda telah selesai! Terima kasih telah menggunakan layanan rekber kami. Kami berharap pengalaman ini memuaskan untuk Anda.</p>
        </>
      )}
      { steps ===5 && (
        <>
        <h4>Dibatalkan</h4>
        <p>Transaksi Anda telah dibatalkan. Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi kami.</p>
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
        <p>{formatRupiah(parseFloat(transaksi.amount))}</p>
       </div>
       <div className='trx'>
        <p>Bergaransi</p>
        <p>{transaksi.beridentitas}</p>
       </div>
       <div className='trx'>
        <p>Biaya Admin  Di Bayar <br/> {transaksi.admin_paid_by}
        </p>
        <p>{formatRupiah(parseFloat(transaksi.admin_fee))}</p>
       </div>
      <div className='trx'>
        <p>Total Harga</p>
        <p>{formatRupiah(parseFloat(transaksi.amount) + parseFloat(transaksi.admin_fee))}</p>
      </div>
      <div className= 'result'></div>
      <div className='trx'>
        <p>Harga Pembeli</p>
        <p>{formatRupiah(totalPembeli())}</p>
      </div>
      <div className='trx'>
        <p>Hasil Penjual</p>
        <p>{formatRupiah(totalPenjual())}</p>
      </div>
    </div>
    <div className='trx-detail'>
      <h4 style={{color:'#01426a',fontSize:'1.5rem',
        marginBottom:'0.5rem',padding:'1rem 2rem'
      }}>Frequently Asked Questions</h4>
      <div style={{margin:'0 3rem'}}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454'}}>Berapa lama proses rekber berlangsung? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>
          Proses transaksi berlangsung hingga pembeli mengkonfirmasi terima barang/jasa.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454'}}>Bagaimana jika pembeli tidak ingin mengkonfirmasi terima barang/jasa ? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>
          Jika Pembeli tidak ingin mengonfirmasi penerimaan barang/jasa dari Anda, silakan hubungi kami dan berikan bukti bahwa Pembeli telah benar-benar menerima barang/jasa tersebut. Setelah itu, kami akan meneruskan pembayaran ke alamat email Anda.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454'}}>Bagaimana Syawalrekber.com melindungi saya? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Syawalrekber.com memastikan penjual dibayar saat barang/jasa telah diterima oleh pembeli,memastikan pembeli menerima pengembalian uang jika barang tidak dikirim atau tidak sesuai dengan deskripsi penjualan
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454'}}>Bagaimana jika terjadi sengketa dalam transaksi?</p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Jika terjadi sengketa antara pembeli dan penjual, kami akan melakukan mediasi untuk memastikan transaksi di selesaikan dengan adil.Silahkan hubungi kami dengan memberikan  detail lengkap sengketa agar kami dapat menyelesaikannya secepat mungkin
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
    </div>
    <div style={{position:'fixed',bottom:'1rem',right:'1rem',zIndex:'999'}}><Link to='https://wa.me/6287831531101'>
    <WhatsAppIcon style={{width:'4rem', height:'auto',backgroundColor:'#3cb95d',padding:'0.3rem',borderRadius:'50%'}}/>
    </Link>
    </div>
    <div className='footer-mytrx'>
      <Footer/>
    </div></div>):(<div style={{color:'black'}}>Transaksi tidak di temukan</div>)
    }</>
  )
}

export default RoomTrx;