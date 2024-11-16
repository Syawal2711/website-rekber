import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useParams,  useNavigate } from 'react-router-dom'

const Aktivate = () => {
    const {token} = useParams();
    const navigate = useNavigate()
    const [error,setError] = useState('Mengaktifkan akun Anda...')
    useEffect(() => {
        const aktif = () => {
          setTimeout(async() => {
            try {
              await axios.get(`/auth/activate/${token}`)
              setError('Akun Anda telah aktif')
               navigate('/login', {
                state: {
                  message: 'Berhasil, Mengaktifkan Akun Anda Silahkan Login',
                },
              });
           } catch (error) {
            setError('Link Telah Kadaluawarsa')
               console.log('Error:',error)
           }
          },2000)
        }
        aktif()
    },[token,navigate])
  return (
    <p style={{color:'black'}}>{error}</p>
  )
}

export default Aktivate