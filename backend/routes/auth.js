const express = require('express');
const fs = require('fs');
const { register, login, transactions,tes, activateAccount,authenticateToken,tranaksionId,agreed,change,updateState,invoice,findInvoice,payout,verifyCaptcha,mytrx,allTrx,findPayout,ipchange,myprofil,resetPassword,newPassword,myChangeProfil,myChangProfil,invoiceSucces,webhookEndpoint,editPassword} = require('../controllers/userControllers')

const router = express.Router();
router.post('/register', register);
router.post('/login',login);
router.get('/trylog/:email/:token',ipchange);
router.get('/myChangeProfil',myChangeProfil)
router.get('/myprofil',authenticateToken,myprofil)
router.post('/editPassword',authenticateToken,editPassword)
router.post('/transactions',authenticateToken,transactions)
router.post('/request-reset-password',resetPassword)
router.post('/reset-password',newPassword);
router.get('/transaction/:id',authenticateToken,tranaksionId)
router.get('/activate/:token',activateAccount);
router.patch('/agreed/:id',authenticateToken,agreed);
router.patch('/invoiceSucces',authenticateToken,invoiceSucces)
router.patch('/myChangProfil',authenticateToken,myChangProfil);
router.patch('/change/:id',authenticateToken,change);
router.patch('/updateState/:id',authenticateToken,updateState)
router.post('/webhook-endpoint',webhookEndpoint)
router.post('/invoice',invoice);
router.get('/findInvoice',findInvoice);  
router.post('/payout',authenticateToken,payout);
router.post('/api/verify-captcha',verifyCaptcha);
router.get('/mytrx',mytrx)
router.get('/allTrx',allTrx);
router.get('/findPayout',findPayout)
router.get('/tes/:myToken',authenticateToken,tes)

module.exports = router;