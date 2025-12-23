const express = require('express');
const router = express.Router();
const { getDashboardStats, getEnrolledClasses, joinClass, getStudentAssignments } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/classes', protect, getEnrolledClasses);
router.post('/join', protect, joinClass);
router.get('/assignments', protect, getStudentAssignments);

module.exports = router;
