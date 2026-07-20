const express = require('express');
const { getPayments, createPayment, deletePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getPayments);
router.post('/', auth, createPayment);
router.delete('/:id', auth, deletePayment);

module.exports = router;
