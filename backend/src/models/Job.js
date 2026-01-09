import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        maxlength: [100, 'Position cannot exceed 100 characters']
    },
    location: {
        type: String,
        trim: true
    },
    locationType: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        default: 'onsite'
    },
    salary: {
        type: String,
        trim: true
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance'],
        default: 'full-time'
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'offered', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    responseDate: {
        type: Date
    },
    jobUrl: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
