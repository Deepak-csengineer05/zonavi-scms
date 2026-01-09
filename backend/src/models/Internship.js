import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        maxlength: [100, 'Role cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
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
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    duration: {
        type: Number, // in months
        min: 1
    },
    stipend: {
        type: Number,
        min: 0
    },
    certificateUrl: {
        type: String,
        trim: true
    },
    isCurrentlyWorking: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-calculate duration before saving
internshipSchema.pre('save', function (next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        this.duration = diffMonths;
    }
    next();
});

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;
