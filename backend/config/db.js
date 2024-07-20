const mysql = require('mysql2/promise')
require('dotenv').config()

// Suggested code may be subject to a license. Learn more: ~LicenseLog:2966684215.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.getConnection()
.then((result) => {
    console.log('Database terhubung!!')
    result.release()
}).catch((err) => {
    console.log('Database gagal Terhubung:',err)
});

module.exports = db 