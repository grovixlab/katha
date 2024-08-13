const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    bookId: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    status: {
        type: String,
        enum: ['taken', 'available'],
        default: 'available',
        required: true
    }
});

module.exports = mongoose.model('Book', bookSchema);