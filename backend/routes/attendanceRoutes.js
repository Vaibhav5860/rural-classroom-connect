const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    markAttendance,
    getClassAttendance,
    getStudentAttendance
} = require('../controllers/attendanceController');

router.post('/', protect, markAttendance);
router.get('/class/:classId', protect, getClassAttendance);
router.get('/student', protect, getStudentAttendance);

module.exports = router;
