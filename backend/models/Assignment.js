const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    dueDate: {
        type: Date,
    },
    totalPoints: {
        type: Number,
        default: 100,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
