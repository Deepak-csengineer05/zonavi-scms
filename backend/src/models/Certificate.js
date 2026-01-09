import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Certificate title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    issuer: {
        type: String,
        required: [true, 'Issuer is required'],
        trim: true,
        maxlength: [100, 'Issuer cannot exceed 100 characters']
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required']
    },
    expiryDate: {
        type: Date
    },
    credentialId: {
        type: String,
        trim: true
    },
    credentialUrl: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    skills: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
