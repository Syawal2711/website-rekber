
const bcrypt = require('bcryptjs')
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const db = require('../config/db')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const axios = require('axios');
const { format } = require('mysql2');



const ACCESS_TOKEN_SECRET = process.env.ACCSESS_TOKEN_SECRET;
// Middleware untuk mengautentikasi token akses
exports.authenticateToken= function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { 
      return res.sendStatus(403);
    } 
    req.user = user;
    next();
  });
}

const formatrupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const transporter = nodemailer.createTransport({
  secure:true,
  host:'smtp.gmail.com',
  port:465,
  auth: {
   user:process.env.SENDMAIL_USER,
   pass: process.env.SENDMAIL_PASS
  }
});

function sendMail(to,sub,msg) {
  transporter.sendMail({
    to:to,
    subject:sub,
    html:msg
  })
}

const generateEmailTemplate = (userId, deviceKey) => `
  <div style="font-family: Arial, Helvetica, sans-serif;">
    <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
    <h2 style="text-align: center;">Mencoba Masuk</h2>
    <div style="padding: 0 1rem;">
      <p style="padding-bottom: 1rem;">Hai,</p>
      <p style="padding-bottom:2rem;"> Perangkat baru mencoba mengakses akun Anda. Anda menerima email ini untuk memastikan bahwa itu memang Anda. Jika memang Anda, silakan klik tautan di bawah ini:</p>
      <div style="text-align:center;padding:2rem 0">
        <a href="${process.env.CLIENT_URL}/trylog/${userId}/${deviceKey}" style="background-color: #00BF63; padding:0.8rem 2rem; font-size:1.2rem; color:white; text-decoration: none; border-radius:5px; font-weight:600;">Itu Saya</a>
      </div>
      <p style="padding-top:2rem;">Tidak yakin atau ingin berhati-hati?</p>
      <p>Setel ulang kata sandi Anda <a href="/">di sini</a> untuk mengamankan akun Anda.</p>
      <p style="padding-top: 2rem;">Terima kasih!</p>
      <p>Tim SyawalRekber.com</p>
    </div>
  </div>
`;

exports.register = async (req, res) => {
    const { email, password } = req.body;
   
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
      try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const activationToken = uuidv4();
      const detectDevice =  uuidv4()

        await db.execute(
          'INSERT INTO users (email, password,activationToken,isActive,device) VALUES (?,?,?,?,?)',
          [email, hashedPassword,activationToken,false,detectDevice]);
        sendMail(email,'Aktifkan Akun Anda',`<div style="font-family: Arial, Helvetica, sans-serif;">
        <h1 style="background-color: #01426a;text-align:center; padding:1rem 0;color: white;">SyawalRekber.com</h1>
        <div style="margin: 0.5rem; border: 1px solid #545454; border-radius: 5px;padding:1rem 2rem;">
            <h2 style="font-weight: 600;color:black;">Selamat Datang di Syawalrekber.com</h2>
            <p style="color: #545454;">Untuk memulai menggunakan akun Anda,harap verifikasi alamat email Anda dengan mengklick tombol di bawah</p>
            <div style="text-align: center;">
                <button style="background-color: blue; padding: 0.5rem; width: 60%;border: none; border-radius: 5px; font-weight: 100;color: white;margin-bottom: 2rem;margin-top:1rem;"><a href="${process.env.CLIENT_URL}/activate/${activationToken}" style="text-decoration: none;color:white;font-weight:600;">Verifikasi Sekarang</a></button>
            </div>
        </div>
    </div>`)
        res.status(201).json({ detectDevice });
       
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ message: 'Email Sudah Terdaftar' });
        } else {
          console.log(err)
          res.status(500).json({ message: 'Internal server error' });
        }
      }}
exports.activateAccount = async (req,res) => {
  const {token} = req.params;
  try {
    const [ result ] = await db.execute('UPDATE users SET isActive = ?, activationToken = NULL WHERE activationToken = ?', [true,token]);
  if(result.affectedRows === 0){
    return res.status(400).send('Gagal Mengaktifkan akun')
  }
  res.status(200).send('Akun Anda telah aktif')
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
}
exports.ipchange11 = async (req, res) => {
  const { email , token } = req.params;
  console.log(token)

  // Validasi input
  if (!token || !email) {
      return res.status(400).send('Token dan email diperlukan');
  }

  const query = 'UPDATE users SET device = JSON_REPLACE(device, ?, "allowed") WHERE email = ?';
  try {
      // Escape token jika ada karakter khusus
      const jsonPath = `$.\"${token}\"`;
      const [result] = await db.execute(query, [jsonPath, email]);

      // Cek apakah ada baris yang terpengaruh
      if (result.affectedRows === 0) {
          return res.status(404).send('Email tidak ditemukan atau perangkat tidak dapat diperbarui');
      }

      return res.status(200).send('Berhasil Memverifikasi Perangkat');
  } catch (error) {
      console.log("Error:", error);
      return res.status(500).send('Terjadi kesalahan saat memverifikasi perangkat');
  }
};

exports.ipchange = async (req, res) => {
  const { email, token } = req.params;
  console.log(token);

  // Validasi input
  if (!token || !email) {
    return res.status(400).send('Token dan email diperlukan');
  }

  try {
    // Ambil data JSON dari kolom device
    const [rows] = await db.execute('SELECT device FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).send('Email tidak ditemukan.');
    }

    let deviceData = JSON.parse(rows[0].device);

    // Cari token yang sesuai
    let tokenIndex = deviceData.tokens.findIndex(t => t.detect === token);

    if (tokenIndex === -1) {
      return res.status(404).send('Token tidak ditemukan dalam device data.');
    }

    // Ubah status token
    deviceData.tokens[tokenIndex].status = 'allowed';

    // Update kembali data ke kolom device
    await db.execute('UPDATE users SET device = ? WHERE email = ?', [JSON.stringify(deviceData), email]);

    return res.status(200).send('Berhasil Memverifikasi Perangkat');
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send('Terjadi kesalahan saat memverifikasi perangkat');
  }
};

exports.login = async (req, res) => {
  const { email, password,detect } = req.body;
  console.log(detect)

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log(rows.device)
    if (rows.length === 0 || !email) {
      return res.status(401).json({ message: 'Akun tidak ditemukan' });
    }

    const user = rows[0];

    if (!user.isActive) {
      return res.status(401).json({ message: 'Akun Anda belum diaktifkan' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Password salah' });
    }
    if(detect !== user.device) {
      const myDevice = jwt.sign({email:user.email},ACCESS_TOKEN_SECRET,{ expiresIn: '1h' })
      
      sendMail(user.email,'Percobaa Login Ke Akun Anda',generateEmailTemplate(user.id,myDevice))
      return res.status(402).json({message:'Perangkat tidak di percaya, Cek email Anda untuk memverifikasi perangakat ini'})
    }

    const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return res.json({ accessToken });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fungsi untuk membuat template email




  exports.transactions = async (req, res) => {
  const { email, peran, product, amount, description, beridentitas, biayaAdmin, adminFee, emailDetail } = req.body;
  const shortUUID = uuidv4().substr(0, 8);
  
  const query = 'INSERT INTO transactions (transaction_id, buyer_email, seller_email, product, amount, description, beridentitas, admin_fee, admin_paid_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    let buyerEmail, sellerEmail;
    if(peran === 'Penjual'){
      buyerEmail = emailDetail;
      sellerEmail = email;
    }
    if (peran === 'Pembeli') {
      sellerEmail = emailDetail;
      buyerEmail = email;
    } 
    await db.execute(query, [shortUUID, buyerEmail, sellerEmail, product, amount, description, beridentitas, adminFee, biayaAdmin]);
    sendMail(emailDetail,'Persetujuan Transaksi',`<div style="font-family: Arial, Helvetica, sans-serif;">
        <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
        <p style="padding:4rem 1rem 2rem 1rem;">Hi <a style="color:blue;">${emailDetail}</a>,</p>
        <p style="width:80%;padding:0 0 1rem 1rem"><a style="color:blue;">${email}</a> telah membuat transaksi dengan Anda di SyawalRekber.com</p>
        <h4 style="padding:0 1rem;">Detail Transaksi:</h4>
        <div style="padding: 0 2rem;">
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:1rem 0 1rem 0;border-top: 1px solid  #d9d9d9;">Transksi ID: ${shortUUID}</p>
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:0 0 1rem 0;">Barang/Jasa: ${product}</p>
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding: 0 0 1rem 0;">Harga: ${formatrupiah(amount)}</p>
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:0 0 1rem 0;">Bergaransi: ${beridentitas}</p>
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding: 0 0 1rem 0;">Biaya Admin: ${formatrupiah(adminFee)}</p>
            <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding: 0 0 1rem 0;">Biaya Admin di bayar: ${biayaAdmin}</p>
        </div>
        <p style="width:95%;padding:1rem 0 2rem 1rem">Harap tinjau persyaratannya dan segera setujui transaksinya.</p>
        <div style="text-align:center;">
          <a href="${process.env.CLIENT_URL}/transaksi/${shortUUID}" style="background-color: #00BF63; padding:0.8rem 2rem; font-size:1.2rem; color:white; text-decoration: none; border-radius:5px; font-weight:600;">Lihat Dan Setujui</a>
        </div>
      </div>
`)
    return res.json({ idTrx: shortUUID });
  } catch (error) {
    console.error('Gagal mengeksekusi transaksi:', error);
    return res.status(500).json({ error: 'Kesalahan server internal' });
  }
};

exports.tranaksionId = async (req,res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('SELECT * FROM transactions WHERE transaction_id = ?',[id]);
    if(result.length === 0 ) {
      return res.status(404).json({message: 'Transaksi tidak ditemukan'});
    }
    res.json(result[0]);
  } catch (error) {
    console.log('Error:',error)
    return res.status(500).json({message: 'Gagal mengambil data dari database'})
  }
}

exports.agreed = async (req,res) => {
  const {id} = req.params;
  const {field} = req.body;
  const allowedFields = {
    buyerAgreed : 'buyerAgreed',
    sellerAgreed : 'sellerAgreed'
  }

  if (!allowedFields[field]) {
    return res.status(400).json({ message: 'Field tidak valid' });
  }

  const query = `UPDATE transactions SET ${allowedFields[field]} = ? WHERE transaction_id = ?`;
  try {
    await db.execute(query,[true,id])
    return res.status(200).send('success')
  } catch (error) {
    console.log('Error:',error)
    return res(500).json({message: 'ada yang salah'})
  }
}

exports.updateState = async (req,res) => {
  const {id} = req.params
  const {step} = req.body;
  console.log(step)
  const query = `UPDATE transactions SET step = ? WHERE transaction_id = ?`;
  try {
    await db.execute(query,[step,id])
    return res.status(200).send('succes')
  } catch (error) {
    console.log('Error:',error)
  }
}

exports.change = async (req,res) => {
  const {id} =req.params;
  const {beridentitas,admin_paid_by, amount, alasan,field,fields,admin_fee,email,email1,changer} = req.body;
  const query = `UPDATE transactions SET amount = ?, beridentitas = ?, admin_paid_by = ?, ${field} = ?, ${fields} = ?, admin_fee = ? WHERE transaction_id
 = ?`;
  try {
    await db.execute(query,[amount,beridentitas,admin_paid_by,false,true,admin_fee,id])
    console.log(email,email1,changer);
    sendMail(email,`Perubahan Detail Transaksi ID: ${id}`,`<div style="font-family: Arial, Helvetica, sans-serif;">
        <h1 style="background-color: #01426a;
        text-align: center;padding: 1rem 0;color: white;";>SyawalRekber.com</h1>
        <div style="padding: 1.5rem 1rem;">
            <p>Hai <a style='color: blue;'>${email}</a>,</p>
            <p>Kami ingin menginformasikan bahwa transaksi Anda dengan ID Transaksi <span style="font-weight: 600;">${id}</span> telah di ubah oleh <a style="color: blue;">${email1}</a>[${changer}].</p>
            <h4>Detail Transaksi:</h4>
            <div style="padding: 0 1rem;">
                <div style="display: flex;justify-content: space-between;border-bottom: 1px solid #d9d9d9;">
                    <p style="font-weight: 600;margin:0;">Harga: ${formatrupiah(amount)}<p>
                </div>
                <div style="display: flex;justify-content: space-between;border-bottom: 1px solid #d9d9d9;">
                    <p style="font-weight: 600;" >Pembayar biaya Admin: ${admin_paid_by}</p>
                </div>
                <div style="display: flex;justify-content: space-between;border-bottom: 1px solid #d9d9d9;">
                    <p style="font-weight: 600;">Biaya Admin: ${formatrupiah(admin_fee)}</p>
                </div>
                <div style="display: flex;justify-content: space-between;">
                    <p style="font-weight: 600;">Bergaransi: ${beridentitas}</p>
                </div>
            </div>
            <h4>Dengan Alasan:</h4>
            <div style="border: 1px solid #d9d9d9;padding: 1rem; border-radius: 5px;margin: 0 1rem;">${alasan}</div>
            <p style="padding-top: 1rem;">Silahkan periksa detail terbaru di akun anda, dan setujui transaksinya</p>
            <div style="text-align: center;padding-top: 2rem;">
            <a href="${process.env.CLIENT_URL}/transaksi/${id}" style="text-decoration: none;background-color: #3cb95d;border-radius: 5px; padding: 1rem 1.5rem; font-weight: 600;color: white;">Lihat dan Setujui</a>
        </div>
        </div>
    </div>`)
    return res.status(200).send('succes change data')
  } catch (error) {
    console.log('Error:',error)
  }
}

exports.invoice = async (req,res) => {
  const {id, amount, email, emailSeller, name,bergaransi} = req.body;
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.xendit.co/v2/invoices/',
      auth: {
        username: process.env.XENDIT_KEY,
        password: ''
      },
      data: {
        external_id:id,
        amount,
        items: [{
          name,
          quantity:1,
          price:amount
        }],
        success_redirect_url: `${process.env.CLIENT_URL}/transaksi/${id}`,
        failure_redirect_url: "https://www.google.com",
      }
    });
    const idInvoice= response.data.id
    const urlInvoice = response.data.invoice_url
    try {
      await db.execute(`UPDATE transactions SET id_invoice = ?,url_invoice = ?, status = ? WHERE transaction_id = ?`,[idInvoice,urlInvoice,'In Progress',id]);
      if(bergaransi === 'Tidak') {
        sendMail(emailSeller,'Pembayaran Diterima Dari Pembeli',emailSellerNo(id,amount,email))
      }
      if(bergaransi === 'Ya') {
        sendMail(emailSeller,'Pembayaran Diterima - Mohon Kirimkan Identitas Anda',emailSellerYes(id,amount,email))
      }
      sendMail(email,'Pembayaran Anda Diterima',emailBuyer(id,amount))
      res.status(200).json(urlInvoice)
    } catch (error) {
      console.log(error)
      res.status(500).json({message:message.error})
    }
   
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

const emailSellerYes = (id,amount,email) => `<div style="font-family: Arial, Helvetica, sans-serif;">
    <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
    <p style="padding:4rem 1rem 2rem 1rem;">Kepada Yth</p>
    <p style="padding:0  1rem">Kami ingin memberitahukan bahwa Pembeli dengan alamat email <a style="color:blue;">${email}</a> telah berhasil melakukan pembayaran untuk transaksi dengan ID:<span style="font-weight: 600;">043940</span> di Syawal Rekber.com dengan nominal <span style="font-weight: 600;">${formatrupiah(amount)}</span>.</p>
    <p style="padding: 0 1rem;">Oleh karena itu, kami mohon agar Anda segera mengirimkan 2 Foto identitas diri Anda sesuai dengan persyaratan kami agar proses transaksi Anda dapat dilanjutkan.</p>
    <h4 style="padding:0 1rem;">Identitas yang perlu anda kirimkan:</h4>
    <div style="padding: 0 2rem;">
        <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:1rem 0 1rem 0;border-top: 1px solid  #d9d9d9;">Foto KTP/SIM/KK/DLL</p>
        <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:0 0 1rem 0;">Foto selfie dengan KTP/SIM/KK/DLL</p>
        <p style="font-weight: 600;border-bottom: 1px solid  #d9d9d9; padding:0 0 1rem 0;">Tulis Nama Anda Dan Nama SyawalRekber.com pada selembar kertas dan foto selfie sambil memegang kertas tersebut</p>
    </div>
    <p style="width:95%;padding:1rem;">Pastikan semua dokumen yang Anda kirimkan jelas dan valid. Setelah identitas Anda berhasil diverifikasi, Anda bisa melanjutkan proses transaksi anda dengan pembeli</p>
    <div style="text-align:center;">
      <a href="https://wa.me/6287831531101?text=Identitas+saya+sebagai+penjual+pada+transaksi+dengan+id+*${id}*" style="background-color: #00BF63; padding:0.8rem 2rem; font-size:1.2rem; color:white; text-decoration: none; border-radius:5px; font-weight:600;">kirim Identitas</a>
    </div>
    <p style="width:95%;padding:1rem 1rem 0 1rem;">Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim support kami.</p>
    <p style="padding: 1rem 1rem 0 1rem;">Terimah kasih!</p>
    <p style="padding: 0 1rem;">Tim SyawalRekber.com</p>
  </div>`

const emailSellerNo = (id,amount,email) => `<div style="font-family: Arial, Helvetica, sans-serif;">
  <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
  <p style="padding:4rem 1rem 2rem 1rem;">Kepada Yth</p>
  <p style="padding:0  1rem">Kami ingin memberitahukan bahwa Pembeli dengan alamat email <a style="color:blue;">${email}</a> telah berhasil melakukan pembayaran untuk transaksi dengan ID:<span style="font-weight: 600;">${id}</span> di Syawal Rekber.com dengan nominal <span style="font-weight: 600;">${formatrupiah(amount)}</span>.</p>
  <p style="padding: 0 1rem;">Silakan lakukan proses transaksi anda kepada pembeli tersebut. Dana akan kami teruskan kepada Anda setelah pembeli mengkonfrimasi terima barang/jasa dari Anda</p>
  <p style="width:95%;padding:1rem 1rem 0 1rem;">Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim support kami.</p>
  <p style="padding: 1rem 1rem 0 1rem;">Terimah kasih!</p>
  <p style="padding: 0 1rem;">Tim SyawalRekber.com</p>
</div>`

const emailBuyer = (id,amount) => `<div style="font-family: Arial, Helvetica, sans-serif;">
  <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
  <p style="padding:4rem 1rem 2rem 1rem;">Kepada Yth</p>
  <p style="padding:0  1rem">Kami ingin menginformasikan bahwa pembayaran Anda untuk transaksi dengan ID:<span style="font-weight:600 ;">${id}</span> dengan nominal <span style="font-weight: 600;">${formatrupiah(amount)}</span> telah kami terima. Dana saat ini sudah diamankan oleh SyawalRekber dan akan diteruskan kepada penjual setelah anda mengkonfrimasi terima barang/jasa dari penjual</p>
  <p style="width:95%;padding:1rem 1rem 0 1rem;">Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim support kami.</p>
  <p style="padding: 1rem 1rem 0 1rem;">Terimah kasih!</p>
  <p style="padding: 0 1rem;">Tim SyawalRekber.com</p>
</div>`
exports.payout = async (req,res) => {
  const {external_id,amount,email} = req.body
  try {
    const response = await axios({
      method:'post',
      url:'https://api.xendit.co/payouts',
      auth: {
        username: process.env.XENDIT_KEY,
        password:''
      },
      data: {
        external_id,
        amount,
        email,
      }
    })
    const idPayout = response.data.id
    try {
      await db.execute('UPDATE transactions SET id_payout = ?, status = ? WHERE transaction_id = ?',[idPayout,'Completed',external_id])
      res.status(200).json({msg:'successfuly'})
    } catch (error) {
      res.status(500).json({error:error.message})
    }
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

exports.findInvoice = async (req,res) => {
  const {id} = req.query
  try {
    const response = await axios({
      method: 'get',
      url: `https://api.xendit.co/v2/invoices/${id}`,
      auth: {
        username: process.env.XENDIT_KEY,
        password: ''
      }
    }) 
    res.status(200).json(response.data.status)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

exports.findPayout = async (req, res) => {
  const { id } = req.query; // Mengambil id dari query parameter
  try {
    const response = await axios({
      method: 'get',
      url: `https://api.xendit.co/payouts/${id}`, // Pastikan ini benar
      auth: {
        username: process.env.XENDIT_KEY,
        // password: '' // Jika tidak diperlukan, bisa dihapus
      }
    });
    res.status(200).json(response.data.status);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};


exports.identities = async (req, res) => {
  try {
    const images = req.files['files'];
    const documents = req.files['files1'];
    const id = req.body.filesId

    // Dapatkan path gambar dan dokumen
    const imagePaths = images.map(file => file.path);
    const documentPaths = documents.map(file => file.path);
    // Simpan informasi file ke database
    const sql = 'INSERT INTO uploads (images, documents,id_identy) VALUES (?,?,?)';
    await db.execute(sql, [JSON.stringify(imagePaths), JSON.stringify(documentPaths),id]);

    // Kirim respons sukses
    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
    // Kirim respons error
    console.log(error)
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

exports.verifyCaptcha = async (req, res) => {
  const { token } = req.body;
  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: process.env.CLOUDFLARE_KEY,
      response: token
    });
    if (response.data.success) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'CAPTCHA validation failed' });
  }
};

exports.mytrx = async (req,res) => {
  const {email,value} = req.query;
  
  const sql = `SELECT * FROM transactions WHERE buyer_email = ? OR seller_email = ? ORDER BY created_at DESC LIMIT ?`
  
  try {
    const [ response ]= await db.execute(sql,[email,email,value]);
    res.status(200).json({msg:response})
  } catch (error) {
    console.log(error)
  }
}

exports.allTrx = async (req,res) => {
  const { email } = req.query;

  const sql = `SELECT * FROM transactions WHERE buyer_email = ? OR seller_email = ?`
  try {
    const [ response ] = await db.execute(sql,[email,email])
    res.status(200).json(response.length)
  } catch (error) {
    console.log(error)
  }
}

exports.myChangeProfil = async(req,res) => {
  const { email } = req.body;
  const query = 'SELECT  name,noHP FROM users WHERE email = ?'
  try {
    const [response]= await db.execute(query,[email])
    res.status(200).json({message:response[0]})

  } catch (error) {
    console.log(error);
    res.status(500).json({message:error})
  }
}
exports.myChangProfil = async (req, res) => {
  const { email, name, noHp } = req.body;

  // Validasi input
  if (!email || !name || !noHp) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'UPDATE users SET name = ?, noHp = ? WHERE email = ?';
  try {
    await db.execute(query, [name, noHp, email]);
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'An error occurred while updating the profile' });
  }
};


exports.myprofil = async(req,res) => {

  const { email } = req.query
  const  query = 'SELECT name,noHp FROM users WHERE email = ?'
  try {
    const [response] = await db.execute(query,[email])
    res.status(200).json({message:response[0]})
  } catch (error) {
    console.log(error)
  }
}


exports.resetPassword = async(req, res) => {
  const { email } = req.body;

  try {
  const [results] = await db.execute('SELECT name FROM users WHERE email = ?', [email])
  if (results.length === 0) {
    return res.status(404).json({ message: 'Email not found' });
  }
  const token = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      sendMail(email,'Reset Password Request',`<div style="font-family: Arial, Helvetica, sans-serif;">
    <h1 style="text-align:center;background-color: #01426a; padding:1rem 0;color:white;font-size:2rem;">SyawalRekber.com</h1>
    <div style="padding: 0 1rem;">
      <p style="padding-bottom: 1rem;padding-top: 2rem;">Hai Muh Syawal,</p>
      <p style="padding-bottom: 2rem;">Anda telah meminta untuk mengatur ulang kata sandi Anda di SyawalRekber.com. Klik tombol di bawah ini untuk mengatur ulang kata sandi Anda</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL}/reset/password/${token}" style="background-color: #00BF63; padding:0.6rem 2rem; font-size:1.2rem; color:white; text-decoration: none; border-radius:5px; border: none;">Reset Password</a>
    </div>
    <p style="padding-top: 2rem;">Jangan bagikan kata sandi Anda kepada siapa pun. SyawalRekber.com tidak akan pernah meminta kata sandi Anda melalui email atau telepon.</p>
    <p style="padding-top: 2rem;">Terimah kasih!</p>
    <p>Tim SyawalRekber.com</p>
    </div>
  </div>`)
      res.status(200).json({ message: 'Reset password link sent!' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Database error' });
  }
};


// 2. Reset Password
exports.newPassword = async (req, res) => {
  const { newPassword,email } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    const [results] = await db.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password has been reset successfully!' });
  } catch (error) {
    console.error('Invalid or expired token:', error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};



exports.tes = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT device FROM users WHERE id = ?';
  try {
    const [response] = await db.execute(query, [id]);
    if (response.length > 0) { // Cek jika ada hasil
      console.log(response[0].device);
      res.status(200).json({ message: response[0].device });
    } else {
      res.status(404).json({ message: 'Device not found' }); // Jika tidak ada hasil
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' }); // Menangani kesalahan
  }
};
