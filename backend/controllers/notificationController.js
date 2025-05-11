const Notification = require('../models/notificationModel');

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

exports.markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification || notification.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Notification not found or unauthorized' });
        }

        notification.read = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
};

exports.clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to clear notifications' });
    }
};
