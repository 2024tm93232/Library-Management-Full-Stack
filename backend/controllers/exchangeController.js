const ExchangeRequest = require('../models/exchangeRequestsModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

exports.sendExchangeRequest = async (req, res) => {
    const { bookId, deliveryMethod, exchangeDuration } = req.body;
    const senderId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.user.toString() === senderId) {
            return res.status(400).json({ message: 'You cannot request your own book' });
        }

        const existingRequest = await ExchangeRequest.findOne({
            sender: senderId,
            recipient: book.user,
            book: bookId,
            status: { $in: ["Pending", "Accepted"] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested this book' });
        }

        const exchangeRequest = new ExchangeRequest({
            sender: senderId,
            recipient: book.user,
            book: bookId,
            deliveryMethod,
            exchangeDuration,
        });

        await exchangeRequest.save();

        const notification = new Notification({
            user: book.user,
            message: `You have a new exchange request for the book "${book.title}".`
        });
        await notification.save();

        res.status(201).json(exchangeRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send exchange request' });
    }
};

exports.acceptExchangeRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const exchangeRequest = await ExchangeRequest.findById(requestId);
        if (!exchangeRequest) {
            return res.status(404).json({ message: 'Exchange request not found' });
        }

        // if (exchangeRequest.recipient.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'You are not authorized to accept this request' });
        // }
        exchangeRequest.status = 'Accepted';
        await exchangeRequest.save();

        const book = await Book.findById(exchangeRequest.book);
        if (book) {
            book.available = false;
            await book.save();
        }

        console.log(book);

        const notificationForSender = new Notification({
            user: exchangeRequest.sender._id,
            message: `Your exchange request for "${book.title}" was accepted.`,
        });
        const notificationForRecipient = new Notification({
            user: exchangeRequest.recipient._id,
            message: `You accepted the exchange request for "${book.title}.`,
        });
        await notificationForSender.save();
        await notificationForRecipient.save();

        res.status(200).json(exchangeRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to accept exchange request' });
    }
};

exports.rejectExchangeRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const exchangeRequest = await ExchangeRequest.findById(requestId);
        if (!exchangeRequest) {
            return res.status(404).json({ message: 'Exchange request not found' });
        }

        // if (exchangeRequest.recipient.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'You are not authorized to reject this request' });
        // }

        exchangeRequest.status = 'Rejected';
        await exchangeRequest.save();

        console.log(exchangeRequest);

        const notificationForSender = new Notification({
            user: exchangeRequest.sender._id,
            message: `Your exchange request for "${exchangeRequest.book.title}.`,
        });
        const notificationForRecipient = new Notification({
            user: exchangeRequest.recipient._id,
            message: `You rejected the exchange request for "${exchangeRequest.book.title}.`,
        });
        await notificationForSender.save();
        await notificationForRecipient.save();

        res.status(200).json(exchangeRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reject exchange request' });
    }
};

exports.getUserExchangeRequests = async (req, res) => {
    const userId = req.user.id;

    try {
        const exchangeRequests = await ExchangeRequest.find({
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .populate('sender', 'name email')
            .populate('recipient', 'name email')
            .populate('book', 'title author genre');

        res.status(200).json(exchangeRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve exchange requests' });
    }
};



