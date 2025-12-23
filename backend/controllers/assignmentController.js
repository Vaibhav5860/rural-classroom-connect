const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, classId } = req.body;

        const assignment = new Assignment({
            title,
            description,
            dueDate,
            class: classId,
            teacher: req.user._id,
            // Handle file attachments if any (placeholder for now, can be added like materials)
        });

        const createdAssignment = await assignment.save();
        res.status(201).json(createdAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments for a class
// @route   GET /api/assignments/class/:classId
// @access  Private
const getClassAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ class: req.params.classId }).sort({ dueDate: 1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Teacher)
const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.id })
            .populate('student', 'name email')
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const submission = new Submission({
            assignment: req.params.id,
            student: req.user._id,
            fileUrl: `/uploads/${req.file.filename}`, // Using multer middleware
        });

        const savedSubmission = await submission.save();
        res.status(201).json(savedSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grade submission
// @route   PUT /api/assignments/submission/:id
// @access  Private (Teacher)
const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';

        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAssignment,
    getClassAssignments,
    getSubmissions,
    submitAssignment,
    gradeSubmission
};
