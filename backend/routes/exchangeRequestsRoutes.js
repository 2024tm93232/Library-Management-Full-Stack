const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const exchangeController = require('../controllers/exchangeController');

router.post('/sendExchangeRequest', authMiddleware, exchangeController.sendExchangeRequest);
router.put('/acceptExchangeRequest/:requestId', exchangeController.acceptExchangeRequest);
router.put('/rejectExchangeRequest/:requestId', exchangeController.rejectExchangeRequest);
router.get('/getUserExchangeRequests', authMiddleware, exchangeController.getUserExchangeRequests);

module.exports = router;

