const express = require('express');
const fs = require('fs');
const { register, login, transactions,tes, activateAccount,authenticateToken,tranaksionId,agreed,change,updateState,invoice,findInvoice,identities,payout,verifyCaptcha,mytrx,allTrx,findPayout } = require('../controllers/userControllers')

const router = express.Router();
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
router.post('/payout',payout);
router.post('/api/verify-captcha',verifyCaptcha);
router.get('/mytrx',authenticateToken,mytrx)
router.get('/allTrx',allTrx);
router.get('/findPayout',findPayout)
router.get('/tes',tes)

module.exports = router;