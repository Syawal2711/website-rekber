import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Trylog = () => {
  const { id, token } = useParams();
  const [error, setError] = useState('Memverifikasi Perangkat...');
  const navigate = useNavigate();

  useEffect(() => {
    const trylog = async () => {
      try {
        const response = await axios.get(`/auth/tes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.setItem('detectDevice',response.data.message )
        setError('Perangkat berhasil diverifikasi!');
        navigate('/login', {
          state: {
            message: 'Berhasil, Memverifikasi Perangkat Anda',
          },
        });
      } catch (error) {
        setError('Link Telah Kadaluwarsa');
        console.log('Error:', error);
      }
    };

    trylog(); // Memanggil fungsi untuk melakukan permintaan
  }, [id, token, navigate]);

  return (
    <p style={{ color: 'black' }}>{error}</p>
  );
};

export default Trylog;
