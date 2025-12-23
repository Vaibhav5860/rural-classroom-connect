const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getClassAssignments,
    getSubmissions,
    submitAssignment,
    gradeSubmission
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, createAssignment);
router.get('/class/:classId', protect, getClassAssignments);
router.get('/:id/submissions', protect, getSubmissions);
router.post('/:id/submit', protect, upload.single('file'), submitAssignment);
router.put('/submission/:id', protect, gradeSubmission);

module.exports = router;
