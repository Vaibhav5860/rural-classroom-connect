const Announcement = require('../models/Announcement');

// @desc    Get all global announcements
// @route   GET /api/announcements
// @access  Private
const getGlobalAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isGlobal: true })
            .populate('author', 'name')
            .sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create global announcement
// @route   POST /api/announcements
// @access  Private (Teacher)
const createGlobalAnnouncement = async (req, res) => {
    const { title, content, important } = req.body;

    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const announcement = new Announcement({
            title,
            content,
            important,
            isGlobal: true,
            author: req.user._id,
        });

        const createdAnnouncement = await announcement.save();
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Teacher)
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        if (req.user.role !== 'teacher' || announcement.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        announcement.title = req.body.title || announcement.title;
        announcement.content = req.body.content || announcement.content;
        announcement.important = req.body.important !== undefined ? req.body.important : announcement.important;

        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Teacher)
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Allow author or maybe any teacher? Let's restrict to author for now.
        if (req.user.role !== 'teacher' || announcement.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGlobalAnnouncements,
    createGlobalAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};
