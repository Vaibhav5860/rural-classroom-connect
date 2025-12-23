const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getDashboardStats = async (req, res) => {
    try {
        // Find classes where the student is enrolled
        const classes = await Class.find({ students: req.user._id });
        const classIds = classes.map(c => c._id);

        // Find pending assignments
        const assignments = await Assignment.find({ class: { $in: classIds } });
        // Logic to filter mainly pending ones would be more complex, simplification for now:
        const pendingAssignments = assignments.length;

        res.json({
            enrolledClasses: classes.length,
            pendingAssignments,
            attendanceRate: 100, // Placeholder
            upcomingClasses: 0, // Placeholder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };

// @desc    Get enrolled classes
// @route   GET /api/student/classes
// @access  Private (Student)
const getEnrolledClasses = async (req, res) => {
    try {
        const classes = await Class.find({ students: req.user._id })
            .populate('teacher', 'name');

        const formattedClasses = classes.map(cls => ({
            id: cls._id,
            name: cls.name,
            subject: cls.subject,
            teacher: cls.teacher ? cls.teacher.name : 'Unknown',
            progress: 0, // Placeholder
        }));

        res.json(formattedClasses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a class
// @route   POST /api/student/classes/join
// @access  Private (Student)
const joinClass = async (req, res) => {
    const { classCode } = req.body;

    try {
        const classToJoin = await Class.findOne({ code: classCode });

        if (!classToJoin) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check if already enrolled
        if (classToJoin.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        classToJoin.students.push(req.user._id);
        await classToJoin.save();

        res.json({ success: true, message: 'Class joined successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentAssignments = async (req, res) => {
    try {
        const classes = await Class.find({ students: req.user._id });
        const classIds = classes.map(c => c._id);
        const assignments = await Assignment.find({ class: { $in: classIds } }).populate('class', 'name');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getEnrolledClasses, joinClass, getStudentAssignments };
