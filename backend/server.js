const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

// Enable CORS for frontend; set CORS_ORIGIN to restrict in production
// app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
const allowedOrigins = [
  "https://rural-classroom-connect.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server or tools like curl/postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("/*", cors());

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health endpoint to verify server and DB connectivity
app.get('/api/health', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const connected = mongoose.connection.readyState === 1;
        const host = mongoose.connection.host || null;
        const nodeVersion = process.version;
        const mongooseVersion = mongoose.version || require('mongoose/package.json').version;
        const uptime = process.uptime();
        const env = process.env.NODE_ENV || 'development';
        const usingAtlas = !!(process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv'));

        res.json({
            ok: true,
            env,
            nodeVersion,
            mongooseVersion,
            uptime,
            dbConnected: connected,
            dbHost: host,
            usingAtlas
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});



// Global error handler to ensure JSON response on unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack || err);
    res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
