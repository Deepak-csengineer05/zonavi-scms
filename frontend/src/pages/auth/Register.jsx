import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GraduationCap, Mail, Lock, User, BookOpen, Eye, EyeOff, Phone, Github, Linkedin, Code2, Shield } from 'lucide-react';
import TermsModal from '../../components/ui/TermsModal';

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
                <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 animate-slide-up">
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
                                            placeholder="+91 1234567890"
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
                                    <select
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        required
                                    >
                                        <option className="text-navy-900" value="">Select your branch</option>
                                        {branches.map((branch) => (
                                            <option className="text-navy-900" key={branch} value={branch}>{branch}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Current Year *</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                    >
                                        <option className="text-navy-900" value="1">1st Year</option>
                                        <option className="text-navy-900" value="2">2nd Year</option>
                                        <option className="text-navy-900" value="3">3rd Year</option>
                                        <option className="text-navy-900" value="4">4th Year</option>
                                    </select>
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

export default Register;
