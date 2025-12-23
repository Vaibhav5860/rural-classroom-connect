const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Private (Teacher)
const markAttendance = async (req, res) => {
    try {
        const { classId, date, records } = req.body;

        if (!classId || !date || !records) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Normalize date to start of day to avoid time mismatched duplicates
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if attendance already exists for this date and class
        let attendance = await Attendance.findOne({
            class: classId,
            date: attendanceDate
        });

        if (attendance) {
            // Update existing record
            attendance.records = records;
            attendance.markedBy = req.user._id;
        } else {
            // Create new record
            attendance = new Attendance({
                class: classId,
                date: attendanceDate,
                records,
                markedBy: req.user._id
            });
        }

        const savedAttendance = await attendance.save();
        res.status(201).json(savedAttendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a class on a specific date
// @route   GET /api/attendance/class/:classId
// @access  Private (Teacher/Student)
const getClassAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { date } = req.query;

        let query = { class: classId };
        if (date) {
            const attendanceDate = new Date(date);
            attendanceDate.setHours(0, 0, 0, 0);
            query.date = attendanceDate;
        }

        const attendance = await Attendance.find(query)
            .populate('records.student', 'name email')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance report for a student
// @route   GET /api/attendance/student
// @access  Private (Student)
const getStudentAttendance = async (req, res) => {
    try {
        // Find all classes the student is enrolled in
        const enrolledClasses = await Class.find({ students: req.user._id });
        const classIds = enrolledClasses.map(c => c._id);

        // Find all attendance records for these classes
        const attendanceRecords = await Attendance.find({
            class: { $in: classIds }
        }).populate('class', 'name');

        // Process records to find student's status
        const studentRecords = attendanceRecords.map(record => {
            const studentStatus = record.records.find(
                r => r.student.toString() === req.user._id.toString()
            );

            if (!studentStatus) return null;

            return {
                id: record._id,
                date: record.date,
                className: record.class.name,
                status: studentStatus.status,
                remarks: studentStatus.remarks
            };
        }).filter(r => r !== null);

        // Calculate stats
        const totalClasses = studentRecords.length; // This counts classes where attendance was TAKEN
        const attended = studentRecords.filter(r => r.status === 'present').length;
        const rate = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

        res.json({
            stats: {
                totalClasses,
                attended,
                rate
            },
            history: studentRecords
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getClassAttendance,
    getStudentAttendance
};
