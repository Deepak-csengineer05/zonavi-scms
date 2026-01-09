import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employerAPI, authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Building2, Mail, Lock, User, Globe, MapPin, Users, Calendar, Eye, EyeOff, Phone, Briefcase } from 'lucide-react';
import TermsModal from '../../components/ui/TermsModal';

const EmployerRegister = () => {
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
        // User Info
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Company Info
        companyName: '',
        industry: '',
        size: '1-10',
        website: '',
        location: '',
        foundedYear: '',
        contactPhone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
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
            await employerAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                industry: formData.industry,
                size: formData.size,
                website: formData.website,
                location: formData.location,
                foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
                contactPhone: formData.contactPhone
            });
            toast.success('Employer account created successfully! Welcome to ZONAVI.');

            // Auto-login after registration
            try {
                const loginResponse = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });

                if (loginResponse.data.token) {
                    localStorage.setItem('token', loginResponse.data.token);
                    localStorage.setItem('user', JSON.stringify(loginResponse.data));
                    toast.success('Login successful! Redirecting to dashboard...');
                    setTimeout(() => navigate('/employer'), 1500);
                } else {
                    // Fallback if no token
                    toast.success('Account created! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (loginError) {
                console.error('Auto-login failed:', loginError);
                toast.success('Account created! Please sign in manually.');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            console.error('Registration Error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please check your connection and try again.';
            toast.error(errorMessage, {
                duration: 5000,
                style: { maxWidth: '500px' }
            });
        } finally {
            setLoading(false);
        }
    };

    const industries = [
        'Technology/IT',
        'Finance & Banking',
        'Healthcare',
        'Education',
        'Manufacturing',
        'Retail & E-commerce',
        'Consulting',
        'Real Estate',
        'Media & Entertainment',
        'Telecommunications',
        'Automotive',
        'Energy & Utilities',
        'Other'
    ];

    const currentYear = new Date().getFullYear();

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
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Your Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="your.email@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Company Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label !text-gray-200">Company Name *</label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        placeholder="Your company name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Industry *</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500"
                                        required
                                    >
                                        <option className="text-navy-900" value="">Select industry</option>
                                        {industries.map((industry) => (
                                            <option className="text-navy-900" key={industry} value={industry}>{industry}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="label !text-gray-200">Company Size *</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                        >
                                            <option className="text-navy-900" value="1-10">1-10 employees</option>
                                            <option className="text-navy-900" value="11-50">11-50 employees</option>
                                            <option className="text-navy-900" value="51-200">51-200 employees</option>
                                            <option className="text-navy-900" value="201-500">201-500 employees</option>
                                            <option className="text-navy-900" value="501-1000">501-1000 employees</option>
                                            <option className="text-navy-900" value="1000+">1000+ employees</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Founded Year</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.foundedYear}
                                            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                                            min="1800"
                                            max={currentYear}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder={currentYear.toString()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="label !text-gray-200">Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="City, Country"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label !text-gray-200">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="https://yourcompany.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="label !text-gray-200">Contact Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                            className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-10"
                                            placeholder="+91 1234567890"
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
                                    Creating your employer account...
                                </div>
                            ) : (
                                <>
                                    <Briefcase className="w-5 h-5 inline mr-2" />
                                    Create Employer Account
                                </>
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
                                {' '}and Privacy Policy. I confirm that I am an authorized representative of this company.
                            </label>
                        </div>
                    </form>

                    <TermsModal
                        isOpen={showTerms}
                        onClose={() => setShowTerms(false)}
                        type="employer"
                    />

                    <div className="border-t border-white/10">
                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                                Sign in
                            </Link>
                        </div>
                        <div className="text-center text-sm text-soft-600 dark:text-soft-400 mt-2">
                            Are you a student?{' '}
                            <Link to="/register/student" className="text-teal-400 hover:text-teal-300 font-medium">
                                Register as Student
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerRegister;
