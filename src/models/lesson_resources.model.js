const mongoose = require('mongoose');

const LessonResourcesSchema = new mongoose.Schema(
    {
        resource_id: {
            type: Number,
            unique: true
        },
        schedule_id: {
            type: Number
        },
        teacher_id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        resource_type: {
            type: String,
            enum: ['LessonPlan', 'Homework', 'Syllabus', 'Other'],
            required: true
        },
        file_url: {
            type: String
        },
        upload_date: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        collection: 'lesson_resources',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('LessonResources', LessonResourcesSchema);
