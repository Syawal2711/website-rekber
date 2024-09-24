import React, { useEffect,useState } from 'react';
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import './mytrx.css'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { formatRupiah } from '../all/allFunction';


const Mytrx = () => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [mytransaksi,setMytransaksi] = useState([]);
    const [value,setValue] = useState(10);
    const [alltrx,setAlltrx] = useState(null)
    const aksesToken = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode(aksesToken);
    const email = decodedToken.email;
   
    useEffect(() => {
        const fetchMyTrx = async () => {
            setLoading(true)
            if (!aksesToken) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('/auth/mytrx', {
                    params: { 
                        email,
                        value
                     },
                    headers: {
                        'Authorization': `Bearer ${aksesToken}`
                    }
                });
                
                setMytransaksi(response.data.msg);
                setLoading(false)
            } catch (error) {
                console.log(error)
                navigate('/login')
            }
        };
            fetchMyTrx();
    }, [value]);

    useEffect(() => {
        const allTrx = async () => {
            try {
                const response = await axios.get('/auth/allTrx', {
                    params: {
                        email
                    },
                    headers: {
                        'Authorization' : `Bearer ${aksesToken}`
                    }
                })
                console.log(response.data)
                setAlltrx(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        allTrx()
    },[])
    
    const handleLoadMore = () => {
        setValue(value + 5)
    }

    const handleRowClick = (transaction_id) => {
        navigate(`/transaksi/${transaction_id}`);
      };
        

  return (
  <div id='transaksi-saya' style={{height:'100%',position:'relative',margin:'0 auto'}}>
    <Navbar/>
    <div className='section styletr'style={{display:'block'}}>
            <h1 style={{color:'#01426a',textAlign:'center',padding:'2rem 0 1rem 0'}}>Transaksi Saya</h1>
        <table className='mytrx' style={{margin:'0 auto'}}>
            <thead style={{backgroundColor:'#01426a',border:'1px solid #545454'}}>
                <tr>
                    <th>ID</th>
                    <th>Barang/Jasa</th>
                    <th>Dibuat</th>
                    <th>Harga</th>
                    <th>Peran</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            {mytransaksi.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{textAlign:'center'}}>Transaksi Tidak ditemukan</td>
                    </tr>
                ) :
                (mytransaksi.map((transaksi) => (
                    <tr
                      key={transaksi.id}
                      onClick={() => handleRowClick(transaksi.transaction_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{transaksi.transaction_id}</td>
                      <td>{transaksi.product}</td>
                      <td>{transaksi.created_at.slice(0, 10)}</td>
                      <td>{formatRupiah(parseFloat(transaksi.amount))}</td>
                      <td>{transaksi.buyer_email === email ? 'Pembeli' : 'Penjual'}</td>
                      <td>{transaksi.status}</td>
                    </tr>
                  )))}
            </tbody>
        </table>
        <div className='lol'>{mytransaksi.length === 0 ? (
            <div style={{color:'black',textAlign:'center'}}>Transaksi Tidak ditemukan</div>
        ) : (mytransaksi.map((transaksi) => (
            <div key={transaksi.id}  className='trx-mobile'    onClick={() => handleRowClick(transaksi.transaction_id)}
            style={{ cursor: 'pointer' }} >
                <div className='mobile' style={{borderBottom:'1px solid #d9d9d9'}}>
                    <p>{transaksi.transaction_id}</p>
                    <p>{transaksi.buyer_email === email ? 'Pembeli' : 'Penjual'}</p>
                </div>
                <div className='mobile'>
                    <p>{transaksi.product}</p>
                    <p>{formatRupiah(parseFloat(transaksi.amount))}</p>
                </div>
                <div className='mobile'>
                    <p>{transaksi.created_at.slice(0,10)}</p>
                    <p>{transaksi.status}</p>
                </div>
            </div>
        )))}  
        </div>
        <div className='button-load'>
        {value < alltrx && <button onClick={handleLoadMore}
        disabled={loading}
        style={{alignItems:'center',
            color:'#545454',
            padding:'8px',
            border:'1px solid #545454',
            fontSize:'0.8rem',
            borderRadius:'5px',
            backgroundColor:'white'
        }}>{loading ? <div className='spinner'></div> : 'Load More'}</button>}
        </div>
    </div>
    <div className='footer-mytrx'>
    <Footer />
    </div>
    </div>
  )
}

export default Mytrx