import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail, getPasswordResetEmail, getEmailVerificationEmail } from '../utils/sendEmail.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password, name, branch, cgpa, year } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                message: userExists.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            name,
            branch,
            cgpa: cgpa || 0,
            year: year || 1
        });

        if (user) {
            // Generate email verification token
            const verifyToken = user.getEmailVerificationToken();
            await user.save({ validateBeforeSave: false });

            // Send verification email (non-blocking)
            const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'SCMS - Verify Your Email',
                    html: getEmailVerificationEmail(verifyUrl, user.name)
                });
            } catch (emailError) {
                console.error('Email error:', emailError);
                // Continue even if email fails
            }

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                token: generateToken(user._id),
                message: 'Registration successful! Please check your email to verify your account.'
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email }, { username: email }]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                branch: user.branch,
                cgpa: user.cgpa,
                year: user.year,
                phone: user.phone,
                linkedin: user.linkedin,
                github: user.github,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role,
                careerScore: user.careerScore,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.branch = req.body.branch || user.branch;
            user.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : user.cgpa;
            user.year = req.body.year || user.year;
            user.phone = req.body.phone || user.phone;
            user.linkedin = req.body.linkedin || user.linkedin;
            user.github = req.body.github || user.github;
            user.bio = req.body.bio || user.bio;
            user.avatar = req.body.avatar || user.avatar;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                name: updatedUser.name,
                branch: updatedUser.branch,
                cgpa: updatedUser.cgpa,
                year: updatedUser.year,
                phone: updatedUser.phone,
                linkedin: updatedUser.linkedin,
                github: updatedUser.github,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
                careerScore: updatedUser.careerScore
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'No user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'SCMS - Password Reset Request',
                html: getPasswordResetEmail(resetUrl, user.name)
            });

            res.json({ message: 'Password reset email sent' });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            message: 'Password reset successful',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const emailVerificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { register, login, getProfile, updateProfile, forgotPassword, resetPassword, verifyEmail };
