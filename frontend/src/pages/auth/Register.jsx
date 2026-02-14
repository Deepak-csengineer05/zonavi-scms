import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GraduationCap, Mail, Lock, User, BookOpen, Eye, EyeOff, Phone, Github, Linkedin, Code2, Shield, ChevronDown, Check, X, Search } from 'lucide-react';
import TermsModal from '../../components/ui/TermsModal';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [scrollOpacity, setScrollOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Fade out logo as we scroll down (0 to 200px)
            const newOpacity = Math.max(0, 1 - scrollY / 200);
            setScrollOpacity(newOpacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        branch: '',
        cgpa: '',
        year: '1',
        phone: '',
        linkedin: '',
        github: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'branch' | 'year'

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (!termsAccepted) {
            toast.error('You must accept the Terms of Service to register');
            return;
        }

        setLoading(true);

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                name: formData.name,
                branch: formData.branch,
                cgpa: parseFloat(formData.cgpa) || 0,
                year: parseInt(formData.year),
                phone: formData.phone,
                linkedin: formData.linkedin,
                github: formData.github
            });
            toast.success('Registration successful! Welcome to ZONAVI.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const branches = [
        'Computer Science',
        'Information Technology',
        'Electronics & Communication',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Aerospace Engineering',
        'Data Science',
        'AI & Machine Learning',
        'Other'
    ];

    const years = [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-500 via-navy-600 to-teal-600 relative overflow-x-hidden">
            {/* Fixed Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Side Text - Left */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block">
                    <h1 className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/5 uppercase tracking-tighter leading-none select-none">
                        JOIN
                    </h1>
                </div>

                {/* Side Text - Right */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
                    <h1 className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/5 uppercase tracking-tighter leading-none select-none">
                        ZONAVI
                    </h1>
                </div>

                {/* Fixed Logo */}
                <div
                    className="absolute top-6 left-1/2 -translate-x-1/2 transition-all duration-300"
                    style={{ opacity: scrollOpacity }}
                >
                    <img src="/logo-secondary.png" alt="ZONAVI" className="h-32 drop-shadow-2xl" />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center pt-44 pb-12 px-4">
                {/* Register Card */}
                <div className="w-full max-w-xl bg-white/0 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Username *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="Choose a unique username"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Academic Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="label !text-gray-200">Branch/Program *</label>
                                    <div
                                        onClick={() => setActiveModal('branch')}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={formData.branch ? 'text-white' : 'text-gray-400'}>
                                            {formData.branch || 'Select your branch'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Current Year *</label>
                                    <div
                                        onClick={() => setActiveModal('year')}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={formData.year ? 'text-white' : 'text-gray-400'}>
                                            {years.find(y => y.value.toString() === formData.year.toString())?.label || formData.year || 'Select Year'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="label !text-gray-200">Current CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        placeholder="0.00 - 10.00"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Optional, can update later</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links (Optional) */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Code2 className="w-5 h-5" />
                                Professional Links (Optional)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">LinkedIn Profile</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="https://linkedin.com/in/yourprofile"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">GitHub Profile</label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="https://github.com/yourusername"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Account Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="Minimum 6 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Confirm Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="Repeat your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating your account...
                                </div>
                            ) : (
                                'Create Student Account'
                            )}
                        </button>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm text-gray-200 dark:text-gray-300">
                                I agree to the{' '}
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(true)}
                                    className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
                                >
                                    Terms of Service
                                </button>
                                {' '}and Privacy Policy. I confirm that all academic details provided are accurate.
                            </label>
                        </div>
                    </form>

                    <TermsModal
                        isOpen={showTerms}
                        onClose={() => setShowTerms(false)}
                        type="student"
                    />

                    {/* Branch Selection Modal */}
                    <SelectionModal
                        isOpen={activeModal === 'branch'}
                        onClose={() => setActiveModal(null)}
                        title="Select Branch"
                        options={branches}
                        value={formData.branch}
                        onSelect={(val) => {
                            setFormData({ ...formData, branch: val });
                            setActiveModal(null);
                        }}
                    />

                    {/* Year Selection Modal */}
                    <SelectionModal
                        isOpen={activeModal === 'year'}
                        onClose={() => setActiveModal(null)}
                        title="Select Year"
                        options={years}
                        value={formData.year}
                        onSelect={(val) => {
                            setFormData({ ...formData, year: val });
                            setActiveModal(null);
                        }}
                    />

                    <div className="border-t border-white/10">
                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                                Sign in
                            </Link>
                        </div>
                        <div className="text-center text-sm text-soft-600 dark:text-soft-400 mt-2">
                            Are you an employer?{' '}
                            <Link to="/register/employer" className="text-teal-400 hover:text-teal-300 font-medium">
                                Register as Employer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable SelectionModal Component (Same as EmployerRegister)
const SelectionModal = ({ isOpen, onClose, title, options, value, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredOptions = options.filter(opt => {
        const label = typeof opt === 'string' ? opt : opt.label;
        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-navy-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col border border-soft-200 dark:border-navy-700 max-h-[70vh]"
                    >
                        <div className="p-4 border-b border-soft-200 dark:border-navy-700 flex items-center justify-between bg-soft-50 dark:bg-navy-900">
                            <h3 className="font-semibold text-navy-900 dark:text-white">{title}</h3>
                            <button onClick={onClose} className="p-1 hover:bg-soft-200 dark:hover:bg-navy-800 rounded-full text-soft-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-3 border-b border-soft-200 dark:border-navy-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-soft-50 dark:bg-navy-900 border-none outline-none text-sm text-navy-900 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                            {filteredOptions.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredOptions.map((opt, idx) => {
                                        const optValue = typeof opt === 'string' ? opt : opt.value;
                                        const optLabel = typeof opt === 'string' ? opt : opt.label;
                                        const isSelected = value.toString() === optValue.toString();

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => onSelect(optValue)}
                                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${isSelected
                                                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium'
                                                        : 'hover:bg-soft-50 dark:hover:bg-navy-700 text-navy-700 dark:text-gray-200'
                                                    }`}
                                            >
                                                <span>{optLabel}</span>
                                                {isSelected && <Check size={16} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-soft-500">
                                    No options found
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Register;
