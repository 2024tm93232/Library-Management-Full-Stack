const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookController.addBook);
router.put('/:id', authMiddleware, bookController.editBook);
router.delete('/:id', authMiddleware, bookController.deleteBook);
router.get('/getUserBooks', authMiddleware, bookController.getUserBooks);
router.get('/getAllBooksList', authMiddleware, bookController.getAllBooksList);
router.get('/getAllBooks', bookController.getAllBooks);

module.exports = router;
