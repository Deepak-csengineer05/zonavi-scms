import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
    // company field removed (duplicate)
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    salary: {
        type: String, // e.g., "10LPA - 15LPA"
        default: 'Not disclosed'
    },
    applyLink: {
        type: String,
        required: [true, 'Application link/email is required']
    },
    deadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    views: {
        type: Number,
        default: 0
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export default JobPosting;
