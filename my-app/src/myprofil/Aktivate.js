import React,{useEffect} from 'react'
import axios from 'axios'
import { useParams,  useNavigate } from 'react-router-dom'

const Aktivate = () => {
    const {token} = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        const aktif = () => {
          setTimeout(async() => {
            try {
              await axios.get(`/auth/activate/${token}`)
               navigate('/login')
           } catch (error) {
               console.log('Error:',error)
           }
          },2000)
        }
        aktif()
    },[token,navigate])
  return (
    <p style={{color:'black'}}>Mengaktifkan Akun Anda</p>
  )
}

export default Aktivate