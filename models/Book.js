const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    bookId: { type: Number, required: true, unique: true },
    author: { type: String, required: true }  // Added field for book author
});

module.exports = mongoose.model('Book', bookSchema);
