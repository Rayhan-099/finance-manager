const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://finance-manager-zeta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Additional explicit preflight handling (Express 5 compatible wildcard)
app.options('(.*)', cors());

// Conect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Basic route
app.get('/', (req, res) => {
    res.send('Finance Manager API is running');
});

// Import Routes
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/expenses/', require('./routes/expenses'));
app.use('/api/analytics/', require('./routes/analytics'));
app.use('/api/ai/', require('./routes/ai'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
