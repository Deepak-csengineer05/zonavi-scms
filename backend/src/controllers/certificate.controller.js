import Certificate from '../models/Certificate.js';
import { calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get all certificates for current user
// @route   GET /api/certificates
// @access  Private
const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id }).sort({ issueDate: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private
const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        if (certificate.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
    try {
        const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, imageUrl, skills } = req.body;

        const certificate = await Certificate.create({
            user: req.user._id,
            title,
            issuer,
            issueDate,
            expiryDate,
            credentialId,
            credentialUrl,
            imageUrl,
            skills: skills || []
        });

        await calculateCareerScore(req.user._id);

        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res) => {
    try {
        let certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        if (certificate.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        if (certificate.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await certificate.deleteOne();
        await calculateCareerScore(req.user._id);

        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate };
