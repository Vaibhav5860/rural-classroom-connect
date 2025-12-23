const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

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
        res.json({ ok: true, dbConnected: connected, dbHost: host });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Dev-only debug endpoint to test DB writes/reads. Disabled in production.
app.get('/api/debug/test-db', async (req, res) => {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ ok: false, message: 'Debug endpoint disabled in production' });

    try {
        const bcrypt = require('bcryptjs');
        const User = require('./models/User');
        const testEmail = `debug-test-${Date.now()}@example.com`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const user = await User.create({ name: 'Debug Tester', email: testEmail, password: hashedPassword });
        // cleanup
        await User.deleteOne({ _id: user._id });

        return res.json({ ok: true, message: 'DB write/read succeeded', testEmail });
    } catch (err) {
        console.error('[debug] test-db error:', err.stack || err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
});

// Global error handler to ensure JSON response on unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack || err);
    res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
