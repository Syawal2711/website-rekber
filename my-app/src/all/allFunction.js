import Swal from 'sweetalert2'

export const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

 export const alertsucces = (title,text,icon) => {
          Swal.fire({
              title: title,
              text: text,
              icon: icon
            });
      }

export const calculateAdminFee = (amountValue) => {
        
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
        fee = amountValue * 0.0075 ;
    }

return fee;
   
};

export const pricingData = [
    {
      title: "Biaya Transaksi",
      range: "10K - 20K",
      price: "5K",
    },
    {
      title: "Biaya Transaksi",
      range: "21K - 290K",
      price: "10K",
    },
    {
      title: "Biaya Transaksi",
      range: "291K - 490K",
      price: "20K",
    },
    {
      title: "Biaya Transaksi",
      range: "491K - 790K",
      price: "25K",
    },
    {
      title: "Biaya Transaksi",
      range: "791K - 900K",
      price: "30K",
    },{
      title: "Biaya Transaksi",
      range: "901K - 999K",
      price: "40K",
    },
    {
      title: "Biaya Transaksi",
      range: "1Jt - 1.9Jt",
      price: "50K",
    },
    {
      title: "Biaya Transaksi",
      range: "2Jt - 2.9Jt",
      price: "60K",
    },
    {
      title: "Biaya Transaksi",
      range: "3Jt - 3.9Jt",
      price: "70K",
    },
    {
      title: "Biaya Transaksi",
      range: "4Jt - 10.9Jt",
      price: "80K",
    },{
      title: "Biaya Transaksi",
      range: "11Jt - 15.9Jt",
      price: "90K",
    },
    {
      title: "Biaya Transaksi",
      range: "16Jt - 20.9Jt",
      price: "100K",
    },
    {
      title: "Biaya Transaksi",
      range: "21Jt- 30Jt",
      price: "200K",
    },
    {
      title: "Biaya Transaksi",
      range: "30Jt - Seterusnya",
      price: "0,75%",
    },
  
    // Tambahkan data lainnya sesuai kebutuhan
  ];