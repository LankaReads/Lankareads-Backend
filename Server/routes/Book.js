const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');

// Cache to store books
let booksCache = null;
let booksCacheTimestamp = null;
const CACHE_DURATION = 60000; // 60 seconds

// Middleware to check if the cache is still valid
function isCacheValid() {
    return booksCache && (Date.now() - booksCacheTimestamp) < CACHE_DURATION;
}

// Route to get all books (with caching)
router.get('/books', async (req, res) => {
    try {
        if (isCacheValid()) {
            return res.json(booksCache);
        }

        const books = await Book.find(); // Fetch all books from MongoDB
        booksCache = books;
        booksCacheTimestamp = Date.now();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Route to create a new book
router.post('/books', async (req, res) => {
    try {
        const { name, image, price, category, description, bookdoc } = req.body;
        const newBook = new Book({ name, image, price, category, description, bookdoc });
        await newBook.save();
        booksCache = null; // Clear cache to reflect new data
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: 'Error creating book', error: error.message });
    }
});

router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
  
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Send the book details including the document URL (bookdoc)
      res.json({
        name: book.name,
        price: book.price,
        image: book.image,
        bookdoc: book.bookdoc,
        description: book.description,
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Route to update a book by Id
router.put('/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        booksCache = null; // Clear cache to reflect updated data
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
});

// Route to delete a book by ID
router.delete('/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        booksCache = null; // Clear cache to reflect updated data
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

// Route to clear the books cache manually
router.post('/clear-cache', (req, res) => {
    booksCache = null;
    booksCacheTimestamp = null;
    res.json({ message: 'Cache cleared' });
});

module.exports = router;
