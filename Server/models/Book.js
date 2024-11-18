const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bookdoc: {
        type: String,
        required: true,  // Add this to store the book PDF link
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
