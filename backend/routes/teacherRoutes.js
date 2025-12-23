const express = require('express');
const router = express.Router();
const { getDashboardStats, getTeacherAssignments } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/assignments', protect, getTeacherAssignments);

module.exports = router;
