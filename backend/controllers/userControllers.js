
const bcrypt = require('bcryptjs')
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const db = require('../config/db')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const axios = require('axios')



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

exports.register = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
      try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const activationToken = uuidv4();
        await db.execute(
          'INSERT INTO users (email, password,activationToken,isActive) VALUES (?,?,?,?)',
          [email, hashedPassword,activationToken,false]);
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
        res.status(201).json({ message: 'Berhasil Membuat Akun Anda,cek email anda untuk mengaktifkan akun Anda' });
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
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0 || !email) {
        return res.status(401).json({ message: 'Akun tidak ditemukan' });
      }
      const user = rows[0];
      if(!user.isActive) {
        return res.status(401).json({message:'Akun Anda belum Di Aktifkan'})
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Password salah' });
      }
  
      const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.json({ accessToken });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' });
    }
  };

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
  const {id, amount, email, name} = req.body;
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
        customer: {
          email
        },
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
      res.status(200).json(urlInvoice)
    } catch (error) {
      res.status(500).json({message:message.error})
    }
   
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}
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
  console.log(value)
  
  const sql = `SELECT * FROM transactions WHERE buyer_email = ? OR seller_email = ? ORDER BY created_at DESC LIMIT ?`
  
  try {
    const [ response ]= await db.execute(sql,[email,email,value]);
    console.log(response.length)
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



exports.tes = async(req,res) => {
  res.send('helllo world')
}  