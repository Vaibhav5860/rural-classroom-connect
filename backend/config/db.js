const mongoose = require('mongoose');

// This project is configured to use MongoDB Atlas only in production.
// MONGO_URI must be set in backend/.env (or environment) and should contain the full connection string.
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not set. Aborting startup — this application requires a MongoDB Atlas connection (MONGO_URI).');
            process.exit(1);
        }
        const uri = process.env.MONGO_URI;
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
