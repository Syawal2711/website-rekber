import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

export default function AccordionExpandDefault() {

  const style = {
    color:'#D9D9D9',
    border:'1px 1px 0 1px solid #D9D9D9'
  }
  return (
    <>
    <div id='faq' style={{width:'60rem',maxWidth:'100%',margin:'0 auto',padding:'2rem'
    }}>
    <motion.h1
    initial={{
      opacity:0,
      x:-50
    }}
    whileInView={{
      opacity:1,
      x:0
    }}
    transition={{duration:'0.8'}}
    viewport={{ once: true }}
     style={{color:'black', margin:'0',borderTop:'1px solid #D9D9D9',paddingTop:'3rem'}}>Frequently Asked Questions</motion.h1>
    </div>
    <div style={{width:'60rem',maxWidth:'100%',padding:'2rem',margin:'0 auto'}}>
      <Accordion style={style} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Apa Itu Rekber? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>
          Rekening bersama atau rekber adalah suatu metode pembayaran secara online yang melibatkan tiga pihak, yakni pihak pembeli, pihak penjual, dan pihak rekber. Pihak rekber bertanggung jawab sebagai jembatan komunikasi antara penjual dan pembeli sehingga proses transaksi antara penjual dan pembeli terjamin kelancarannya.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Bagaimana Cara Menggunakan Rekber? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>
          Silahkan mengisi formulir transaksi setelah itu anda akan diarahkan ke halaman ruangan transaksi untuk melakukan proses transaksi Anda
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Berapa Biaya Transaksi? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Biaya transaksi tergantung dari nominal harga barang/jasa
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Siapa yang menanggung biaya jasa rekber? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Biaya rekber dapat di tanggung oleh Penjual,Pembeli ataupun 50%/50% sesuai kesepakatan yang ditentukan
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Bagaimana jika barang yang di terima tidak seusai? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Pembeli dapat mengajukan komplain dan membatalkan transaksi jika brang yang diterima tidak sesuai deskripsi penjualan. Setelah itu pembeli melakukan retur barang kepada pihak penjual dan kami akan mengembalikan dananya kembali kepada pihak pembeli.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Jenis Transaksi yang di perbolehkan?</p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>Kami menyediakan dukungan untuk semua jenis transaksi, kecuali yang berkaitan dengan barang atau jasa ilegal.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={style}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <p style={{color:'#545454',fontWeight:'600'}}>Bagaimana Proses Bayar Membayar? </p>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{color:'#545454'}}>
          Kami akan mengirimkan email konfirmasi pembayaran kepada penjual setelah menerima transaksi dari Anda. Setelah transaksi selesai, kami juga akan mengirimkan email yang berisi rincian pembayaran sesuai dengan jumlah yang telah ditentukan.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    </>
  );
}
