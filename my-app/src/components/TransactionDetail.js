import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import './TransactionDetail.css'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const TransactionDetail = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { formData } = location.state || { formData: {} };
    const accessToken = localStorage.getItem('accessToken')
    const decodedToken = jwtDecode(accessToken)

    const email = decodedToken.email
    const [peran, setPeran] = useState(formData.peran || '');
    const [product, setProduct] = useState(formData.product || '');
    const [amount, setAmount] = useState(formData.amount || '');
    const [description, setDescription] = useState(formData.description || '');
    const [beridentitas, setBeridentitas] = useState(formData.beridentitas || '');
    const [biayaAdmin, setBiayaAdmin] = useState('Pembeli');
    const [adminFee, setAdminFee] = useState(0)
    const [emailDetail,setEmailDetail] = useState('')// Sesuaikan nilai default jika diperlukan

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('AccessToken:',accessToken)
        try {
            const response = await axios.post('http://192.168.57.128:3001/auth/transactions',{
                email,
                peran,
                product,
                amount,
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
            console.log(response.data)
            navigate('/')
            } catch (err) {
            console.log('Ada yang salah:', err)
        }
    }
    useEffect(() => {
        const calculateAdminFee = () => {
            let amountValue = parseFloat(amount);
            if (isNaN(amountValue)) {
                return 0;
            }
            
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
        setAdminFee(calculateAdminFee());
    }, [amount]);

    const totalPembeli = () => {
        const amountValue = parseFloat(amount);
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
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue)) {
            return 0;
        }

        switch (biayaAdmin) {
            case 'Penjual' : return amountValue - adminFee;
            case '50%/50%' : return amountValue - (adminFee / 2);
            default : return amountValue;
        }
    }

    const harga = parseFloat(amount);
    const hargaTotal = harga + adminFee;

    return (
        <div className='container-detail'>
            <div className='detail'>
                <h1>Buat Transaksi</h1>
                <div className='box-detail'>
            <form onSubmit={handleSubmit}>
            <div className='box-form'>
                <label>
                    <p>Saya Sebagai:</p>
                    <select name='peran' value={peran} onChange={(e) => setPeran(e.target.value)}>
                        <option value='Penjual'>Penjual</option>
                        <option value='Pembeli'>Pembeli</option>
                    </select>
                </label>
                <br />
                <label>
                    <p>Barang/Jasa</p>
                    <input type='text' name='product' value={product} onChange={(e) => setProduct(e.target.value)} required />
                </label>
                <br />
                <label>
                    <p>Harga:</p>
                    <input type='number' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </label>
                <br />
                <div className='box-two'>
                <label>
                    <p>Beridentitas:</p>
                    <select name='beridentitas' value={beridentitas} onChange={(e) => setBeridentitas(e.target.value)} required>
                        <option value='Ya'>Ya</option>
                        <option value='Tidak'>Tidak</option>
                    </select>
                </label>
                </div>
                <br />
                <label>
                    <p>Deskripsi:</p>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </label>
                </div>
                <div className='ringkasan'>
                    <h4>Ringkasan Transaksi</h4>
                    < div className
                    ='item subtotal'>
                    <p>Harga :</p>
                    <p>Rp { amount || '0'}</p>
                    </div>
                    <div className='item adminfee'>
                    <p>Biaya Transaksi Di Bayar: {<select name='biaya' value={biayaAdmin} onChange={(e) => setBiayaAdmin(e.target.value)}>
                   <option value='Pembeli'>Pembeli</option>
                   <option value='Penjual'>Penjual</option>
                   <option value='50%/50%'>50%/50%</option>
                   </select>
                    }</p>
                    <p>Rp {adminFee}</p>
                    </div>
                    <div className='item harga-total'>
                        <p>Total Harga</p>
                        <p>Rp {hargaTotal || '0'}</p>
                    </div>
                    <div className='item harga-pembeli'>
                        <p>Harga Pembeli</p>
                        <p>Rp {totalPembeli()}</p>
                    </div>
                    <div className='item'>
                        <p>Hasil Penjual</p>
                        <p>Rp {totalPenjual()}</p>
                    </div>
                    <div className='email-detail'>
                    {peran === 'Pembeli' && (
                        <>
                        <h4>Detail Penjual</h4>
                        <p>Masukka Email Penjual:</p>
                        <input type='email' value={emailDetail} onChange={(e) => setEmailDetail(e.target.value)} required />
                        </>
                    )}
                    {peran === 'Penjual' && (
                        <>
                        <h4>Detail Pembeli</h4>
                        <p>Masukkan Email Pembeli:</p>
                        <input type='email' value={emailDetail} onChange={(e) => setEmailDetail(e.target.value)} required />
                        </>
                    )}
                </div>
                </div>
                
                <button type='submit'>Buat Rekber</button>
            </form>
            </div>
            </div>
        </div>
    );
};

export default TransactionDetail;