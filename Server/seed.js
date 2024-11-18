const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book'); // Adjust the path if needed

// Load environment variables
dotenv.config();

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, )
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err.message));

// Dummy data for books
const books = [
    {
        name: 'The Great Gatsby',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 10.99,
        category: 'Historic',
        description: 'A novel written by American author F. Scott Fitzgerald.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'To Kill a Mockingbird',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 8.99,
        category: 'Classic',
        description: 'A novel by Harper Lee published in 1960.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: '1984',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 12.99,
        category: 'Dystopian',
        description: 'A novel by George Orwell published in 1949.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'Moby Dick',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 9.99,
        category: 'Adventure',
        description: 'A novel by Herman Melville published in 1851.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'War and Peace',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 14.99,
        category: 'Historic',
        description: 'A novel by Leo Tolstoy published from 1865 to 1869.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'The Catcher in the Rye',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 11.99,
        category: 'Fiction',
        description: 'A novel by J.D. Salinger published in 1951.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'Brave New World',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 10.49,
        category: 'Science Fiction',
        description: 'A novel by Aldous Huxley published in 1932.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'The Road',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 13.49,
        category: 'Post-Apocalyptic',
        description: 'A novel by Cormac McCarthy published in 2006.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'Life of Pi',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 12.99,
        category: 'Adventure',
        description: 'A novel by Yann Martel published in 2001.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'The Hobbit',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 11.49,
        category: 'Fantasy',
        description: 'A novel by J.R.R. Tolkien published in 1937.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'The Divine Comedy',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 15.49,
        category: 'Classic',
        description: 'An epic poem by Dante Alighieri published in the 14th century.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    },
    {
        name: 'Don Quixote',
        image: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_cover_images%2FHarry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg?alt=media&token=83166be2-4c93-4075-8177-1ef479629332',
        price: 14.99,
        category: 'Classic',
        description: 'A novel by Miguel de Cervantes published in two parts in 1605 and 1615.',
        bookdoc: 'https://firebasestorage.googleapis.com/v0/b/lankareads-9ae56.appspot.com/o/book_doc%2Fbook.pdf?alt=media&token=bf159ac1-568a-4e69-bccf-cd304f0f9c01' // Changed to bookdoc
    }
];

// Seed the database
const seedDatabase = async () => {
    try {
        // Clear existing books
        await Book.deleteMany({});
        console.log('Existing books cleared');

        // Add new books
        await Book.insertMany(books);
        console.log('Books inserted');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
};

// Run the seed function
seedDatabase();
