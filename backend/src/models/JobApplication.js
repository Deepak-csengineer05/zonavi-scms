import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'under-review', 'shortlisted', 'rejected', 'accepted'],
        default: 'applied'
    },
    coverLetter: {
        type: String,
        maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    resumeUrl: {
        type: String,
        trim: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate applications
jobApplicationSchema.index({ student: 1, job: 1 }, { unique: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
