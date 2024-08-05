const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { register, login, transactions,tes, activateAccount,authenticateToken,tranaksionId,agreed,change,updateState,invoice,findInvoice,identities,payout } = require('../controllers/userControllers')

const router = express.Router()
const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to 'uploads' directory
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
      }
    })
  });

  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

router.post('/register', register);
router.post('/login',login);
router.post('/transactions',authenticateToken,transactions)
router.get('/transaction/:id',authenticateToken,tranaksionId)
router.get('/activate/:token',activateAccount);
router.patch('/agreed/:id',authenticateToken,agreed);
router.patch('/change/:id',authenticateToken,change);
router.patch('/updateState/:id',authenticateToken,updateState)
router.post('/invoice',invoice);
router.get('/findInvoice',findInvoice);  
router.post('/upload',upload.fields([{name:'files',maxCount:3},{name:'files1',maxCount:3}]),identities);
router.post('/payout',payout)
router.get('/tes',tes)

module.exports = router;