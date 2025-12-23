const express = require('express');
const router = express.Router();
const {
    getGlobalAnnouncements,
    createGlobalAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGlobalAnnouncements);
router.post('/', protect, createGlobalAnnouncement);
router.put('/:id', protect, updateAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);

module.exports = router;
