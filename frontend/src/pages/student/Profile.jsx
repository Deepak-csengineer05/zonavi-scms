import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Linkedin, Github, BookOpen, Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import AvatarUpload from '../../components/ui/AvatarUpload';
import PageWrapper from '../../components/ui/PageWrapper';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        branch: '',
        cgpa: '',
        year: '1',
        phone: '',
        linkedin: '',
        github: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                branch: user.branch || '',
                cgpa: user.cgpa || '',
                year: user.year?.toString() || '1',
                phone: user.phone || '',
                linkedin: user.linkedin || '',
                github: user.github || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Updating profile...');

        try {
            const { data } = await authAPI.updateProfile({
                ...formData,
                cgpa: parseFloat(formData.cgpa) || 0,
                year: parseInt(formData.year)
            });
            updateUser({ ...user, ...data });
            toast.success('Profile updated successfully!', { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const branches = [
        'Computer Science', 'Information Technology', 'Electronics & Communication',
        'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
        'Chemical Engineering', 'Other'
    ];



    // Calculate Profile Strength
    const calculateStrength = () => {
        let score = 0;
        let total = 0;
        const fields = [
            user?.name, user?.email, user?.phone, user?.bio,
            user?.branch, user?.year, user?.cgpa,
            user?.linkedin, user?.github, user?.avatar
        ];

        total = fields.length;
        score = fields.filter(f => f && f.toString().length > 0).length;

        return Math.round((score / total) * 100);
    };

    const strength = calculateStrength();
    const getStrengthColor = (s) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };
    const getProgressBarColor = (s) => {
        if (s >= 80) return 'bg-green-500';
        if (s >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <PageWrapper className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="text-soft-600 dark:text-soft-400">Manage your personal information and portfolio</p>
                </div>
                <button
                    onClick={() => navigate('/resume')}
                    className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    <FileText className="w-4 h-4" />
                    Resume Builder
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Profile Strength Card */}
                <div className="card md:col-span-2 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-navy-800 dark:text-white">Profile Strength</h3>
                            <p className="text-sm text-soft-500">Complete your profile to attract more recruiters</p>
                        </div>
                        <span className={`text-2xl font-bold ${getStrengthColor(strength)}`}>{strength}%</span>
                    </div>
                    <div className="w-full bg-soft-200 dark:bg-navy-900 rounded-full h-3 mb-4 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(strength)}`}
                            style={{ width: `${strength}%` }}
                        />
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-soft-600 dark:text-soft-400">
                        {strength < 100 ? (
                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                <AlertCircle className="w-3 h-3" />
                                {10 - Math.round((strength / 100) * 10)} field(s) remaining
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                Profile Completed!
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Avatar Upload */}
                <div className="flex flex-col items-center justify-center">
                    <AvatarUpload
                        currentAvatar={user?.avatar}
                        onUploadSuccess={(url) => updateUser({ ...user, avatar: url })}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Info */}
                <div className="card">
                    <h2 className="section-title mb-4">Account Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Username</label>
                            <div className="input bg-soft-200 dark:bg-navy-600 cursor-not-allowed">
                                {user?.username}
                            </div>
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <div className="input bg-soft-200 dark:bg-navy-600 cursor-not-allowed flex items-center gap-2">
                                <Mail className="w-4 h-4 text-soft-500" />
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="card">
                    <h2 className="section-title mb-4">Personal Information</h2>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input pl-10"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input pl-10"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="label">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="input min-h-[100px]"
                                placeholder="Tell us about yourself..."
                                maxLength={500}
                            />
                            <p className="text-xs text-soft-500 mt-1">{formData.bio.length}/500 characters</p>
                        </div>
                    </div>
                </div>

                {/* Academic Info */}
                <div className="card">
                    <h2 className="section-title mb-4">Academic Information</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="label">Branch</label>
                            <select
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="">Select branch</option>
                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                value={formData.cgpa}
                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                className="input"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="label">Year</label>
                            <select
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="input"
                            >
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="card">
                    <h2 className="section-title mb-4">Social Links</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">LinkedIn</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="input pl-10"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">GitHub</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                                <input
                                    type="url"
                                    value={formData.github}
                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    className="input pl-10"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="btn btn-primary px-8">
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </PageWrapper>
    );
};

export default Profile;
