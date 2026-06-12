const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deleteAlert } = require('../API/alert_api');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createAlert);
router.get('/', protect, getAlerts);
router.delete('/delete/:id', protect, deleteAlert);

module.exports = router;
