useEffect(() => {
        const allTrx = async () => {
            if (!aksesToken) {
                // Token tidak ada, arahkan ke halaman login
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('/auth/allTrx', {
                    params: { 
                        email
                     },
                    headers: {
                        'Authorization': `Bearer ${aksesToken}`
                    } 
                });
                console.log('muhsyawal')
                setAllTrx(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        allTrx()
    },[])