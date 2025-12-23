const Class = require('../models/Class');
const Announcement = require('../models/Announcement');

// Helper to parse legacy schedule string like 'Mon 09:00-10:00; Tue 10:00-12:00'
const parseScheduleString = (s) => {
    if (!s) return [];
    if (Array.isArray(s)) return s; // already structured
    return s.split(/;|,/).map(part => part.trim()).filter(Boolean).map(part => {
        const m = part.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
        if (m) return { day: m[1], start: m[2], end: m[3] };
        const [day, times] = part.split(' ');
        const [start, end] = (times || '').split('-');
        return { day: day || 'Mon', start: start || '09:00', end: end || '10:00' };
    });
};

// Ensure schedule is returned as array for clients
const normalizeClassSchedule = (cls) => {
    if (!cls) return cls;
    const c = cls.toObject ? cls.toObject() : { ...cls };
    if (c.schedule && typeof c.schedule === 'string') {
        c.schedule = parseScheduleString(c.schedule);
    }
    if (!c.schedule) c.schedule = [];
    return c;
};

// @desc    Get all classes (for testing mainly, or discovery)
// @route   GET /api/classes
// @access  Public (or Protected)
const getClasses = async (req, res) => {
    try {
        let query = {};
        if (req.query.teacher === 'me' && req.user && req.user.role === 'teacher') {
            query.teacher = req.user._id;
        }

        const classes = await Class.find(query).populate('teacher', 'name email');
        // Normalize schedules for clients (migrate legacy strings)
        const normalized = classes.map(c => normalizeClassSchedule(c));
        res.json(normalized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private
const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('students', 'name email');

        if (classItem) {
            res.json(normalizeClassSchedule(classItem));
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (Teacher only)
const createClass = async (req, res) => {
    const { name, subject, description, schedule, code } = req.body;

    try {
        // Accept either array or legacy string schedule
        const scheduleToStore = Array.isArray(schedule) ? schedule : parseScheduleString(schedule);

        const newClass = new Class({
            name,
            subject,
            description,
            schedule: scheduleToStore,
            code,
            teacher: req.user._id,
        });

        const createdClass = await newClass.save();
        res.status(201).json(createdClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get announcements for a class
// @route   GET /api/classes/:id/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ class: req.params.id })
            .populate('author', 'name')
            .sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/classes/:id/announcements
// @access  Private (Teacher)
const createAnnouncement = async (req, res) => {
    const { title, content, important } = req.body;

    try {
        const announcement = new Announcement({
            title,
            content,
            important,
            class: req.params.id,
            author: req.user._id,
        });

        const createdAnnouncement = await announcement.save();
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private (Teacher only)
const updateClass = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check user
        if (classItem.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // If schedule provided as string or array, normalize to array
        if (req.body.schedule !== undefined) {
            req.body.schedule = Array.isArray(req.body.schedule) ? req.body.schedule : parseScheduleString(req.body.schedule);
        }

        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(normalizeClassSchedule(updatedClass));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private (Teacher only)
const deleteClass = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check user
        if (classItem.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await classItem.deleteOne();
        res.json({ message: 'Class removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getClasses,
    getClassById,
    createClass,
    getAnnouncements,
    createAnnouncement,
    updateClass,
    deleteClass,
};
