
const bcrypt = require('bcryptjs')
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const db = require('../config/db')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');


const ACCESS_TOKEN_SECRET = process.env.ACCSESS_TOKEN_SECRET;
// Middleware untuk mengautentikasi token akses
exports.authenticateToken= function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('authHeader:',authHeader);
  console.log('token',token)
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(403);
    } 
    req.user = user;
    next();
  });
}


const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token:process.env.REFRESH_TOKEN });


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

        const accessToken = await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'syawalrekber@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: 'syawalrekber@gmail.com',
            to: 's19199346@gmail.com',
            subject: 'Aktifkan Akun Anda',
            html:`<div style="font-family: Arial, Helvetica, sans-serif;">
        <h1 style="background-color: #004AAD;text-align:center; padding:1rem 0;color: white;">Syawalrekber.com</h1>
        <div style="margin: 0.5rem; border: 1px solid #545454; border-radius: 5px;padding:1rem 2rem;">
            <h2 style="font-weight: 600;color:black;">Selamat Datang di Syawalrekber.com</h2>
            <p style="color: #545454;">Untuk memulai menggunakan akun Anda,harap verifikasi alamat email Anda dengan mengklick tombol di bawah</p>
            <div style="text-align: center;">
                <button style="background-color: blue; padding: 0.5rem; width: 60%;border: none; border-radius: 5px; font-weight: 100;color: white;margin-bottom: 2rem;margin-top:1rem;"><a href="${process.env.CLIENT_URL}/activate/${activationToken}" style="text-decoration: none;color:white;font-weight:600;">Verifikasi Sekarang</a></button>
            </div>
        </div>
    </div>`
        };
        transporter.sendMail(mailOptions,(err, info) => {
          if(err) {
            return
            console.log(err)
          }
          console.log('Email sent:', info.response);
        });
        res.status(201).json({ message: 'Berhasil Membuat Akun Anda,cek email anda untuk mengaktifkan akun anda' });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ message: 'Email Sudah Ada' });
        } else {
          console.log(err)
          res.status(500).json({ message: 'Internal server error' });
        }
      }}
exports.activateAccount = async (req,res) => {
  const {token} = req.params
  try {
    const [ result ] = await db.execute('UPDATE users SET isActive = ? WHERE activationToken = ?', [true,token]);
  if(result.affectedRows === 0){
    return res.status(400).send('Gaga Mengaktifkan akun')
  }
  res.status(200).send('Akun Anda Sudah Aktif')
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

exports.transactions = async(req,res) => {
    const {email,peran,product,amount,description,beridentitas,biayaAdmin,adminFee,emailDetail} = req.body;
    const shortUUID = uuidv4().substr(0, 6)
    const query = 'INSERT INTO transactions (transaction_id, buyer_email, seller_email,product, amount,description, beridentitas, admin_fee, admin_paid_by) VAlUES (?,?,?,?,?,?,?,?,?)'
    try {
      if(peran === 'Penjual') {
     await db.execute(query,[shortUUID,email,emailDetail,product,amount,description,beridentitas,adminFee,biayaAdmin])
     return res.json({message: 'Berhasil Membuat Transakso'})
    }else{
      await db.execute(query,[shortUUID,emailDetail,email,product,amount,description,beridentitas,adminFee,biayaAdmin])
      return res.json({message: 'Berhasil Membuat Transaksi'})
    }
    } catch (error) {
      console. log('gagal mengeksekusi data',error)
      res.status(500)
    }
  };

exports.tranaksionId = async (req,res) => {
  const {id} = req.params;
  try {
    const [result] = await db.execute('SELECT * FROM transactions WHERE transaction_id = ?',[id]);
    if(result.length === 0 ) {
      return res.status(4).json({message: 'Transaksi tidak ditemukan'});
    }
    res.json(result[0]);
  } catch (error) {
    console.log('Error:',error)
    res.status(500).json({message: 'Gagal mengambil data dari database'})
  }
}

exports.tes = async(req,res) => {
  res.send('helllo world')
}  

exports.protected = async (req, res) => {
    res.json({ message: 'Ini adalah data yang dilindungi.' });
  }