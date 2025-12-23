const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    description: {
        type: String,
    },
    // schedule now stored as an array of entries: [{ day, start, end }]
    schedule: [
        {
            day: { type: String },
            start: { type: String },
            end: { type: String },
        }
    ],
    code: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);
