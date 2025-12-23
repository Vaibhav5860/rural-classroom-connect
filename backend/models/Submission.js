const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileUrl: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    grade: {
        type: Number,
    },
    feedback: {
        type: String,
    },
    status: {
        type: String,
        enum: ['submitted', 'graded', 'pending'],
        default: 'submitted',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Submission', submissionSchema);
