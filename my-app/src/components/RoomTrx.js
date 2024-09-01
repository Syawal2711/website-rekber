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
    adminFee:'Penjual',
    identitas:'Ya',
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
        navigate('/login')
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
          if((response.data === 'PAID' || response.data === 'SETTLED') && transaksi.beridentitas
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

const calculateAdminFee = (amountValue) => {
  if (isNaN(amountValue)) return 0;
  
  let fee = 0;

  if (amountValue >= 1 && amountValue <= 20000) {
      fee = 5000;
  } else if (amountValue >= 21000 && amountValue <= 290000) {
      fee = 10000;
  } else if (amountValue >= 291000 && amountValue <= 490000) {
      fee = 20000;
  } else if (amountValue >= 491000 && amountValue <= 790000) {
      fee = 25000;
  } else if (amountValue >= 791000 && amountValue <= 900000) {
      fee = 30000;
  } else if (amountValue >= 901000 && amountValue <= 999000) {
      fee = 40000;
  } else if (amountValue >= 1000000 && amountValue <= 1999000) {
      fee = 50000;
  } else if (amountValue >= 2000000 && amountValue <= 2999000) {
      fee = 60000;
  } else if (amountValue >= 3000000 && amountValue <= 3999000) {
      fee = 70000;
  } else if (amountValue >= 4000000 && amountValue <= 10999000) {
      fee = 80000;
  } else if (amountValue >= 11000000 && amountValue <= 15999000) {
      fee = 90000;
  } else if (amountValue >= 16000000 && amountValue <= 20999000) {
      fee = 100000;
  } else if (amountValue >= 21000000 && amountValue <= 30000000) {
      fee = 200000;
  } else if (amountValue > 30000000) {
      fee = 250000;
  }

  return fee;
};

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
    window.location.href = `https://wa.me/6281524575677?text=Identitas+saya+sebagai+penjual+pada+transaksi+dengan+id+*${transaksi.transaction_id}*`
  
  }
  const handleSubmit = async(field,fields) => {
    try {
      await axios.patch(`/auth/change/${transaksiId}`, {
        beridentitas : changeData.identitas,
        admin_paid_by : changeData.adminFee,
        amount : changeData.amount,
        alasan : changeData.alasan,
        field,
        fields,
        admin_fee: changeData.admin_fee
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
        amount: totalPembeli()
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
      <p>Dana diterima,silahkan lakukan transaksi anda</p>
    )}
    {steps === 3 && (
      <p>Pembayaran Ke Penjual sebesar IDR {totalPenjual()}</p>
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
              <form onSubmit={changeBuyer}>
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
                <p>Biaya Transaksi</p>
                <input type='number' name='adminfee' value={changeData.admin_fee} onChange={handleChange}
                readOnly 
                />
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
              <form onSubmit={changeSeller}>
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
                <p>Biaya Transaksi</p>
                <input type='number' name='adminfee' value={changeData.admin_fee} onChange={handleChange}
                readOnly 
                />
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
              <p>Menunggu pembeli melakukan pembayaran ke Syawalrekber.com</p>
            </div>
          )}
          {transaksi.beridentitas === 'Ya' && (
            <div>
              <h4>Transaksi Beridentitas</h4>
              <div className='step-identy'>
            <p>1.Anda harus mengirimkan 2 Identitas yang menunjukkan alamat Anda ke whatsapp kami</p>
            <p>2.Identitas harus jelas dan apabila identitas kurang jelas kami akan menyuruh anda mengirim ulang identitas dengan kualitas yang lebih baik.
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
            <p style={{marginBottom:'10px'}}>Silahkan pilih dua identitas yang menunjukkan alamat Anda. Foto identitas dan ambil juga foto selfie sambil memegang identitas.</p>
            <p style={{marginBottom:'2rem'}}>Tulis nama Anda dan nama website kami,serta tanggal dan waktu saat ini pada selembar kertas. Kemudian ambil foto sambil memegang kertas tersebut.</p>
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
            {(status === 'PENDING' || status === null) && <p>Silahkan lakukan pembayaran ke syawalrekber.com untuk melanjutkan transaksi anda dengan mengklick tombol di bawah</p>}
            {(status === 'PAID' ||status ===  'SETTLED') && <p>Dana diterima menunggu pembeli selesai mengirimkan Identitasnya</p>}
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
            <p>Dana diterima,silahkan lakukan transaksi ke penjual,dan apabila anda telah menerima barang/jasanya dari pembeli silahkan klik tombol dibawah untuk mencairkan dana ke penjual </p>
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
          Proses transaksi berlangsung hingga pembeli menerima barang/jasanya.
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
          <Typography style={{color:'#545454'}}>Jika terjadi sengketa antara pembeli dan penjual, kami akan melakukan mediasi untuk memastikan transaksi di selesaikan dengan adil.Silakan hubungi kami dengan memberikan  detail lengkap sengketa agar kami dapat menyelesaikannya secepat mungkin
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
    </div>
    <div style={{position:'fixed',bottom:'1rem',right:'1rem'}}><Link to='https://wa.me/6281524575677'>
    <WhatsAppIcon style={{width:'4rem', height:'auto',backgroundColor:'#3cb95d',padding:'0.3rem',borderRadius:'50%'}}/>
    </Link>
    
    </div>
    </>
  )
}

export default RoomTrx;