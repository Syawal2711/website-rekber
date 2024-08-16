import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/images/img1.png';
import './Home.css';

function Home() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        peran: '',
        product: '',
        amount: '',
        beridentitas: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        <div id="home" className="section">
            <div className='page home-left'>
                <h1>Jangan Pernah Membeli Atau Menjual Barang Secara Online Tanpa Menggunakan Syawalrekber.com</h1>
                <p>Dengan Syawalrekber.com Anda Dapat Membeli Dan Menjual Apapun Dengan Aman</p>
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
                                placeholder="Produk/Jasa"
                                value={formData.product}
                                onChange={handleChange}
                                required
                            /> 
                        </div>
                        <div className='input-form'>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Jumlah"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            /> 
                            
                        
                                <select name="beridentitas" value={formData.beridentitas} onChange={handleChange}>
                                    <option value='' disabled defaultValue>Beridentitas</option>
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
                    <p>2.Pembeli Melakukan Pembyaran Ke Syawalrekber.com</p>
                    <p>3.Penjual Dan Pembeli Melakukan Transaksi</p>
                    <p>4.Pembeli Mengkonfirmasi Produk/Jasanya</p>
                    <p>5.Syawalrekber.com Melakukan Pembayaran Ke Penjual</p>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Home;
