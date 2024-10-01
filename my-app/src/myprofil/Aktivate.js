import React,{useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const Aktivate = () => {
    const {token} = useParams();
    console.log(token)
    console.log('haiiiiiii')
    const navigate = useNavigate()
    useEffect(() => {
        const aktif = async() => {
            try {
                const response = await axios.get(`/auth/activate/${token}`)
                navigate('/login')
            } catch (error) {
                console.log('Error:',error)
            }
        }
        aktif()
    },[token,navigate])
  return (
    <p style={{color:'black'}}>Mengaktifkan Akun Anda</p>
  )
}

export default Aktivate