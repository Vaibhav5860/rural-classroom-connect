const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get teacher dashboard stats
// @route   GET /api/teacher/dashboard
// @access  Private (Teacher)
const getDashboardStats = async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user._id });
        const classIds = classes.map(c => c._id);

        const totalStudents = classes.reduce((acc, curr) => acc + curr.students.length, 0);
        const assignments = await Assignment.find({ class: { $in: classIds } });
        const assignmentIds = assignments.map(a => a._id);

        const pendingSubmissions = await Submission.countDocuments({
            assignment: { $in: assignmentIds },
            status: 'submitted'
        });

        res.json({
            totalClasses: classes.length,
            totalStudents,
            pendingSubmissions,
            upcomingClasses: 0, // Placeholder logic
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeacherAssignments = async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user._id });
        const classIds = classes.map(c => c._id);
        const assignments = await Assignment.find({ class: { $in: classIds } }).populate('class', 'name');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getTeacherAssignments };
