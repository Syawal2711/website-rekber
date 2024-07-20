const express = require('express');
const { register, login, transactions, protected,tes, activateAccount,authenticateToken,tranaksionId,agreed } = require('../controllers/userControllers')

const router = express.Router();


router.post('/register', register);
router.post('/login',login);
router.post('/transactions',authenticateToken,transactions)
router.get('/protected',authenticateToken, protected);
router.get('/transaction/:id',authenticateToken,tranaksionId)
router.get('/activate/:token',activateAccount);
router.patch('/agreed/:id',authenticateToken,agreed)
router.get('/tes',tes)

module.exports = router;