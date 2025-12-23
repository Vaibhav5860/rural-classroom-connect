const express = require('express');
const router = express.Router();
const {
    getClasses,
    getClassById,
    createClass,
    getAnnouncements,
    createAnnouncement,
    updateClass,
    deleteClass,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getClasses);
router.post('/', protect, createClass);
router.get('/:id', protect, getClassById);
router.put('/:id', protect, updateClass);
router.delete('/:id', protect, deleteClass);
router.get('/:id/announcements', protect, getAnnouncements);
router.post('/:id/announcements', protect, createAnnouncement);

module.exports = router;
