import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'tools', 'languages', 'soft-skills', 'other'],
        default: 'other'
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate skills for same user
skillSchema.index({ user: 1, name: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
