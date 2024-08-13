const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// Book Adding Route
router.get('/add', (req, res) => {
    res.render('book-add', { title: "Add Book" });
});

router.post('/add', async (req, res) => {
    const { bookName, bookNumber } = req.body;
    try {
        const book = new Book({ bookName, bookId: bookNumber });
        await book.save();
        res.redirect('/books/add');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Fetch Book by ID
router.get('/api/book/:id', async (req, res) => {
    const bookId = req.params.id;
    
    // Ensure the ID is a valid MongoDB ObjectId
    if (!bookId) {
        return res.status(400).json({ message: 'Invalid book ID' });
    }

    try {
        const book = await Book.findOne({ bookId: bookId });

        if (book) {
            res.json({ bookName: book.bookName });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
