const Book = require('../models/bookModel');
const User = require('../models/userModel');

exports.addBook = async (req, res) => {
    const { title, author, genre, condition, available } = req.body;
    const userId = req.user.id;

    try {
        const newBook = new Book({ title, author, genre, condition, available, user: userId });
        await newBook.save();

        // let user = await User.findById(userId);
        // user.booksOwned.push(newBook);
        // await user.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add book' });
    }
};

exports.editBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, condition, available } = req.body;

    try {
        const updatedBook = await Book.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, author, genre, condition, available },
            { new: true }
        );

        if (!updatedBook) return res.status(404).json({ message: 'Book not found or unauthorized' });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Failed to edit book' });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deletedBook) return res.status(404).json({ message: 'Book not found or unauthorized' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete book' });
    }
};

exports.getUserBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const books = await Book.find({ user: userId })
            .sort({ updatedAt: -1 });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve books' });
    }
};

exports.getAllBooksList = async (req, res) => {
    const userId = req.user.id;

    try {
        const books = await Book.find({ user: { $ne: userId } })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found from other users' });
        }

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve books' });
    }
};
