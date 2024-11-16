const express = require('express');
const fs = require('fs');
const { register, login, transactions,tes, activateAccount,authenticateToken,tranaksionId,agreed,change,updateState,invoice,findInvoice,identities,payout,verifyCaptcha,mytrx,allTrx,findPayout,ipchange,myprofil,resetPassword,newPassword,myChangeProfil,myChangProfil} = require('../controllers/userControllers')

const router = express.Router();
router.post('/register', register);
router.post('/login',login);
router.get('/trylog/:email/:token',ipchange);
router.get('/myChangeProfil',myChangeProfil)
router.get('/myprofil',authenticateToken,myprofil)
router.post('/transactions',authenticateToken,transactions)
router.post('/request-reset-password',resetPassword)
router.post('/reset-password',newPassword);
router.get('/transaction/:id',authenticateToken,tranaksionId)
router.get('/activate/:token',activateAccount);
router.patch('/agreed/:id',authenticateToken,agreed);
router.patch('/myChangProfil',authenticateToken,myChangProfil);
router.patch('/change/:id',authenticateToken,change);
router.patch('/updateState/:id',authenticateToken,updateState)
router.post('/invoice',invoice);
router.get('/findInvoice',findInvoice);  
router.post('/payout',payout);
router.post('/api/verify-captcha',verifyCaptcha);
router.get('/mytrx',authenticateToken,mytrx)
router.get('/allTrx',allTrx);
router.get('/findPayout',findPayout)
router.get('/tes/:id',authenticateToken,tes)

module.exports = router;