import { useState, useEffect } from 'react';
import { employerAPI } from '../../services/api';
import { Building2, Globe, MapPin, Users, Calendar } from 'lucide-react';
import PageWrapper from '../../components/ui/PageWrapper';
import { toast } from 'react-hot-toast';

const EmployerProfile = () => {
    // const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        companyName: '',
        description: '',
        industry: '',
        size: '1-10',
        website: '',
        location: '',
        foundedYear: '',
        contactEmail: '',
        contactPhone: '',
        logo: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await employerAPI.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await employerAPI.updateProfile(profile);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Company Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company information</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-6">
                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Building2 className="w-4 h-4 inline mr-2" />
                            Company Name *
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={profile.companyName}
                            onChange={handleChange}
                            required
                            className="input"
                            placeholder="Acme Corporation"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Description
                        </label>
                        <textarea
                            name="description"
                            value={profile.description}
                            onChange={handleChange}
                            rows={4}
                            className="input resize-none"
                            placeholder="Tell students about your company, culture, and mission..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Industry
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={profile.industry}
                                onChange={handleChange}
                                className="input"
                                placeholder="e.g., Technology, Finance"
                            />
                        </div>

                        {/* Company Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Users className="w-4 h-4 inline mr-2" />
                                Company Size
                            </label>
                            <select
                                name="size"
                                value={profile.size}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501-1000">501-1000 employees</option>
                                <option value="1000+">1000+ employees</option>
                            </select>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Globe className="w-4 h-4 inline mr-2" />
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={profile.website}
                                onChange={handleChange}
                                className="input"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                className="input"
                                placeholder="Bangalore, India"
                            />
                        </div>

                        {/* Founded Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Founded Year
                            </label>
                            <input
                                type="number"
                                name="foundedYear"
                                value={profile.foundedYear}
                                onChange={handleChange}
                                min="1800"
                                max={new Date().getFullYear()}
                                className="input"
                                placeholder="2020"
                            />
                        </div>

                        {/* Logo URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Logo URL
                            </label>
                            <input
                                type="url"
                                name="logo"
                                value={profile.logo}
                                onChange={handleChange}
                                className="input"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={profile.contactEmail}
                                onChange={handleChange}
                                className="input"
                                placeholder="hr@company.com"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={profile.contactPhone}
                                onChange={handleChange}
                                className="input"
                                placeholder="+91 1234567890"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-navy-700">
                        <button
                            type="button"
                            onClick={fetchProfile}
                            className="btn btn-secondary"
                            disabled={saving}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default EmployerProfile;
