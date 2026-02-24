const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':***@')); // Hide password

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Mongoose connection error:', err.message);
        if (err.message.includes('bad auth')) {
            console.error('ACTION REQUIRED: Check your username and password.');
        } else if (err.message.includes('timeout')) {
            console.error('ACTION REQUIRED: Whitelist your IP in MongoDB Atlas!');
        }
        process.exit(1);
    });
