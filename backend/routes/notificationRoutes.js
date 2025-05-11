const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getUserNotifications',authMiddleware, notificationController.getUserNotifications);
router.put('/:notificationId/markAsRead',authMiddleware, notificationController.markAsRead);
router.delete('/clearNotifications', authMiddleware,notificationController.clearNotifications);

module.exports = router;
