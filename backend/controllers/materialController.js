const Material = require('../models/Material');

// @desc    Upload material
// @route   POST /api/materials/:classId
// @access  Private (Teacher)
const uploadMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const material = new Material({
            title: req.body.title || req.file.originalname,
            description: req.body.description,
            type: req.file.mimetype,
            fileUrl: `/uploads/${req.file.filename}`,
            class: req.params.classId,
            teacher: req.user._id,
        });

        const createdMaterial = await material.save();
        res.status(201).json(createdMaterial);
    } catch (error) {
        console.error("Upload failed", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get materials for a class
// @route   GET /api/materials/:classId
// @access  Private
const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ class: req.params.classId }).sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadMaterial,
    getMaterials,
};
