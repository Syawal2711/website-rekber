import React, { useState, useEffect } from 'react';
import {Link ,useLocation,useNavigate } from 'react-router-dom';
import './TransactionDetail.css'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar'
import Footer from './Footer'
import '../myprofil/mytrx.css';
import { formatRupiah,calculateAdminFee } from '../all/allFunction';

const TransactionDetail = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { formData } = location.state || { formData: {} };
    const accessToken = localStorage.getItem('accessToken')
    const decodedToken = jwtDecode(accessToken)

    const [peran, setPeran] = useState(formData.peran || 'Penjual');
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(formData.product || '');
    const [amount, setAmount] = useState(formData.amount || '');
    const [originalValue,setOriginalValue] = useState(formData.originalValue || '')
    const [description, setDescription] = useState(formData.description || '');
    const [beridentitas, setBeridentitas] = useState(formData.beridentitas || 'Ya');
    const [biayaAdmin, setBiayaAdmin] = useState('Pembeli');
    const [adminFee, setAdminFee] = useState(0)
    const [emailDetail,setEmailDetail] = useState('')// Sesuaikan nilai default jika diperlukan
    const email = decodedToken.email;
    const [isChecked,SetIsChecked] = useState(false)
    const [msgError,setErrorMsg] = useState({
        amount: '',
        description: '',
        product: '',
        email:''
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if(originalValue < 10000) {
            setLoading(false)
            setErrorMsg(prev => ({ ...prev, amount: 'Transaksi minimal Rp 10,000' }));
        return;
        }
        if(originalValue >= 50000000) {
            setLoading(false)
            setErrorMsg(prev => ({...prev, amount: 'Transaksi maksimal Rp 50.000.000'}))
            return;
        }

        if (product.length >= 30) {
            setLoading(false);
            setErrorMsg(prev => ({ ...prev, product: 'Nama Barang maksimal 30 kata' }));
            return;
        }
        if(description.length >= 250) {
            setLoading(false);
            setErrorMsg(prev => ({...prev, description: 'Deskripsi maksimal 250 kata'}))
            return;
        }
        if(email === emailDetail) {
            setLoading(false)
            setErrorMsg(prev => ({...prev, email : 'Anda memasukkan email Anda sendiri'}))
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailDetail)) {
      setLoading(false);
      setErrorMsg(prev => ({...prev,email:'Email tidak valid. Harap masukkan email yang benar.'}));
      return 
    }
        setTimeout( async () => {
            try {
                const response = await axios.post('/auth/transactions',{
                    email,
                    peran,
                    product,
                    amount : originalValue,
                    description,
                    beridentitas,
                    biayaAdmin,
                    adminFee,
                    emailDetail
                },{
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                navigate(`/transaksi/${response.data.idTrx}`)
                
                } catch (err) {
                    navigate('/login')
            }
            setLoading(false)
        }, 2000)
        
    }
    
    useEffect(() => {
        let amountValue = parseFloat(originalValue);
        setAdminFee(calculateAdminFee(amountValue));
    }, [originalValue]);

      const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Hanya angka
        setAmount(formatRupiah(inputValue));
        setOriginalValue(inputValue); // Nilai asli tanpa format
    };         
    
    const totalPembeli = () => {
        const amountValue = parseFloat(originalValue);
        if (isNaN(amountValue)) {
            return 0;
        }

        switch (biayaAdmin) {
            case 'Pembeli' : return amountValue + adminFee;
            case '50%/50%' : return amountValue + (adminFee / 2);
            default : return amountValue;
        }
    }

    const totalPenjual = () => {
        const amountValue = parseFloat(originalValue);
        if (isNaN(amountValue)) {
            return 0;
        } 

        switch (biayaAdmin) {
            case 'Penjual' : return amountValue - adminFee;
            case '50%/50%' : return amountValue - (adminFee / 2);
            default : return amountValue;
        }
    }
    const harga = parseFloat(originalValue);
    const validHarga = !isNaN(harga) ? harga : 0;  // Gunakan nilai default 0 jika harga adalah NaN
    const validAdminFee = !isNaN(adminFee) ? adminFee : 0;  // Pastikan adminFee juga valid

    const hargaTotal = validHarga + validAdminFee;


    const handleChecked = () => {
        SetIsChecked(!isChecked)
    }

    return (<div id='transaksi-saya'><Navbar/>
        <div className='container-detail'>
            <div className='detail'>
                <h1>Buat Transaksi</h1>
                <div className='box-detail'>   
            <form onSubmit={handleSubmit}>
            <div className='box-form'>
                <label>
                    <p>Saya Sebagai</p>
                    <select name='peran' value={peran} onChange={(e) => setPeran(e.target.value)}>
                        <option value='Penjual'>Penjual</option>
                        <option value='Pembeli'>Pembeli</option>
                    </select>
                </label>
                <br />
                <label>
                    <p>Barang/Jasa</p>
                    <input type='text' name='product' value={product} onChange={(e) => setProduct(e.target.value)} required/>
                    <p1 style={{color:'red',padding:'5px 0 0 5px',fontSize:'0.8rem'}}>{msgError.product}</p1>
                </label>
                <br />
                <label>
                    <p>Harga</p>
                    <input type='text' name='amount' placeholder='Rp 100.000' value={amount} onChange={handleInputChange} required />
                    <p1 style={{color:'red',padding:'5px 0 0 5px',fontSize:'0.8rem'}}>{msgError.amount}</p1>
                </label>
                <br />
                <div className='box-two'>
                <label>
                    <p>Bergaransi</p>
                    <select name='beridentitas' value={beridentitas} onChange={(e) => setBeridentitas(e.target.value)} required>
                        <option value='Ya'>Ya</option>
                        <option value='Tidak'>Tidak</option>
                    </select>
                </label>
                </div>
                <br />
                <label>
                    <p>Deskripsi</p>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <p1 style={{color:'red',padding:'5px 0 0 5px',fontSize:'0.8rem'}}>{msgError.description}</p1>
                </label>
                </div>
                <div className='ringkasan'>
                    <h4>Ringkasan Transaksi</h4>
                    < div className
                    ='item subtotal'>
                    <p>Harga</p>
                    <p>{formatRupiah(originalValue)}</p>
                    </div>
                    <div className='item adminfee'>
                    <p>Biaya Transaksi Di Bayar: {<select name='biaya' value={biayaAdmin} onChange={(e) => setBiayaAdmin(e.target.value)}>
                   <option value='Pembeli'>Pembeli</option>
                   <option value='Penjual'>Penjual</option>
                   <option value='50%/50%'>50%/50%</option>
                   </select>
                    }</p>!
                    <p>{formatRupiah(adminFee)}</p>
                    </div>
                    <div className='item harga-total'>
                        <p>Total Harga</p>
                        <p>{formatRupiah(hargaTotal)}</p>
                    </div>
                    <div className='item harga-pembeli'>
                        <p>Harga Pembeli</p>
                        <p>{formatRupiah(totalPembeli())}</p>
                    </div>
                    <div className='item'>
                        <p>Hasil Penjual</p>
                        <p>{formatRupiah(totalPenjual())}</p>
                    </div>
                    <div className='email-detail'>
                    {peran === 'Pembeli' && (
                        <>
                        <h4>Detail Penjual</h4>
                        <p>Masukkan Email Penjual</p>
                        <input type='email' value={emailDetail} onChange={(e) => setEmailDetail(e.target.value)} required />
                        <p1 style={{color:'red',padding:'5px 0 0 5px',fontSize:'0.8rem'}}>{msgError.email}</p1>
                        </>

                    )}
                    {peran === 'Penjual' && (
                        <>
                        <h4>Detail Pembeli</h4>
                        <p>Masukkan Email Pembeli</p>
                        <input type='email' value={emailDetail} onChange={(e) => setEmailDetail(e.target.value)} required />
                        <p1 style={{color:'red',padding:'5px 0 0 5px',fontSize:'0.8rem'}}>{msgError.email}</p1>
                        </>
                    )}
                </div>
                </div>
                <div className='buttons'>
                <label style={{display:'flex',marginTop:'2rem'}}>
                <input style={{width:'2rem'}}
                type='checkbox' 
          checked={isChecked} 
          onChange={handleChecked} 
          required // Menandai checkbox harus dicentang
        />
        <p style={{color:'#545454',paddingTop:'0.9rem',paddingLeft:'0.5rem',fontSize:'0.9rem'}}>Saya telah membaca dan menyetujui <Link to='/Intructions'>Petunjuk Umum Rekber</Link> dan <Link to='/privacypolice'>Kebijakan privasi</Link></p>
            </label>
            </div> 
                <button type='submit' disabled={loading || !isChecked}>{loading ? <div className= 'spinner'></div> : 'Buat Transaksi'}</button>
                
            </form>
            </div>
            </div>
        </div>
        <div className='footer-mytrx'>
        <Footer/>
        </div>
        </div> 
    );
};

export default TransactionDetail;