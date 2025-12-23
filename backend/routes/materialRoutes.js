const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials } = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/:classId', protect, upload.single('file'), uploadMaterial);
router.get('/:classId', protect, getMaterials);

module.exports = router;
