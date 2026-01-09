import User from '../models/User.js';

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Create the URL for the uploaded file
        // Assumes 'uploads' folder is served statically
        const avatarUrl = `/uploads/${req.file.filename}`;

        // Update user profile with avatar URL
        const user = await User.findById(req.user._id);

        if (user) {
            user.avatar = avatarUrl;
            await user.save();

            res.json({
                message: 'Avatar uploaded successfully',
                avatarUrl: avatarUrl
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};

export { uploadAvatar };
