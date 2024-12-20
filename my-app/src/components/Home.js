import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/images/home.png';
import './Home.css';
import { formatRupiah } from '../all/allFunction';

function Home() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        peran: '',
        product: '',
        amount: '',
        originalValue:'',
        beridentitas: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const inputValue = e.target.value.replace(/[^0-9]/g, "");
        if (name === 'amount') {
            setFormData({
                ...formData,
                amount : formatRupiah(inputValue),
                originalValue : inputValue
            });
        }
         else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setTimeout(()=>{
            navigate('/detail', { state: { formData } });
            setLoading(false)
        },2000)
        
       
    };

    const isFormValid = () => {
        return formData.peran !== '' && formData.beridentitas !== '';
    };

    return (
        <div style={{backgroundColor:'#01426a'}}>
        <div id="home" className="section" style={{paddingTop:"3.5rem"}}>
            <div className='page home-left'>
                <h1>Jangan Pernah Membeli Atau Menjual Barang Secara Online Tanpa Menggunakan SyawalRekber.com</h1>
                <p>Dengan SyawalRekber.com Anda Dapat Membeli Dan Menjual Apapun Dengan Aman</p>
                <div className='form'>
                    <form onSubmit={handleSubmit}>    
                        <div className='input-form'>
                                <select name="peran" value={formData.peran} onChange={handleChange}>
                                    <option value='' disabled defaultValue>Saya Sebagai</option>
                                    <option value="Penjual">Penjual</option>
                                    <option value="Pembeli">Pembeli</option>
                                </select>
                            <input
                                type="text"
                                name="product"
                                placeholder="Barang/Jasa"
                                value={formData.product}
                                onChange={handleChange}
                            /> 
                        </div>
                        <div className='input-form'>
                            <input
                                type="text"
                                name="amount"
                                placeholder="Harga"
                                value={formData.amount}
                                onChange={handleChange}
                            /> 
                            
                        
                                <select name="beridentitas" value={formData.beridentitas} onChange={handleChange}>
                                    <option value='' disabled defaultValue>Bergaransi</option>
                                    <option value="Ya">Ya</option>
                                    <option value="Tidak">Tidak</option>
                                </select>
                        </div>
                        <div className='buton'>
                            <button type="submit" disabled={!isFormValid && loading}>{loading ? <div className ='spinner' ></div> : 'Buat Rekber'}</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='page home-right'>
                <div className='img'>
                    <img src={img1} alt="img"/>
                </div>
                <div className='title'>
                    <h3>Jual Atau Beli jasa Atau Produk Dengan Aman</h3>
                    <p>1.Penjual Dan Pembeli Menyetujui Transaksi</p>
                    <p>2.Pembeli Melakukan Pembayaran Ke SyawalRekber</p>
                    <p>3.Penjual Dan Pembeli Melakukan Transaksi</p>
                    <p>4.Pembeli Mengkonfirmasi Terima Barang/Jasanya</p>
                    <p>5.Syawalrekber Melakukan Pembayaran Ke Penjual</p>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Home;
