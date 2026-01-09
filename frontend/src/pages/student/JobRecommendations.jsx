
import { useState, useEffect } from 'react';
import { jobPostingsAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/ui/PageWrapper';
import { Briefcase, MapPin, IndianRupee, ExternalLink, Calendar, Building2, Star, Filter, FileText, Building, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const JobRecommendations = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'applied'
    const [filter, setFilter] = useState('all'); // all, recommended (sub-filter for new jobs)

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = filter === 'recommended' ? { filter: 'recommended' } : {};

            // Parallel fetch for better performance
            const [jobsRes, appsRes] = await Promise.all([
                jobPostingsAPI.getAll(params),
                applicationAPI.getMyApplications()
            ]);

            setJobs(jobsRes.data);
            setApplications(appsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load career hub');
        } finally {
            setLoading(false);
        }
    };

    // Derived state
    const appliedJobIds = new Set(applications.map(app => app.job?._id));
    const newJobs = jobs.filter(job => !appliedJobIds.has(job._id));

    // Handler for "Quick Apply"
    const handleQuickApply = async (job) => {
        try {
            await applicationAPI.apply({ jobId: job._id });
            toast.success('Application submitted successfully!');

            // Open external link
            const url = job.applyLink?.startsWith('http') ? job.applyLink : `https://${job.applyLink}`;
            window.open(url, '_blank');

            // Refresh data to move job to "Applied" tab
            fetchData();
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error('You have already applied to this job');
            } else {
                console.error('Failed to apply', err);
                toast.error('Failed to submit application');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'under-review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            interviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            offered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
            rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            withdrawn: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
        return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="page-title">Career Hub</h1>
                    <p className="text-soft-600 dark:text-soft-400 mt-1">
                        Find new opportunities and track your applications
                    </p>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-200 dark:border-navy-700 mb-6">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'new'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <Briefcase className="w-4 h-4" />
                    New Opportunities
                    <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full text-xs">
                        {newJobs.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('applied')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'applied'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Applied Jobs
                    <span className="bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                        {applications.length}
                    </span>
                </button>
            </div>

            {loading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card h-40 animate-pulse">
                            <div className="h-6 bg-soft-200 dark:bg-navy-600 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-soft-200 dark:bg-navy-600 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-soft-200 dark:bg-navy-600 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {activeTab === 'new' && (
                        <div className="animate-fade-in">
                            {/* Sub-filters for New Jobs */}
                            <div className="flex justify-end mb-4">
                                <div className="flex bg-soft-100 dark:bg-navy-700 p-1 rounded-lg">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all'
                                            ? 'bg-white dark:bg-navy-600 text-teal-600 shadow-sm'
                                            : 'text-soft-600 dark:text-soft-400 hover:text-navy-700 dark:hover:text-soft-200'
                                            }`}
                                    >
                                        All New
                                    </button>
                                    <button
                                        onClick={() => setFilter('recommended')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${filter === 'recommended'
                                            ? 'bg-white dark:bg-navy-600 text-teal-600 shadow-sm'
                                            : 'text-soft-600 dark:text-soft-400 hover:text-navy-700 dark:hover:text-soft-200'
                                            }`}
                                    >
                                        <Star className="w-3 h-3 fill-current" />
                                        Recommended
                                    </button>
                                </div>
                            </div>

                            {newJobs.length > 0 ? (
                                <div className="grid gap-6">
                                    {newJobs.map((job) => (
                                        <div key={job._id} className="card hover:border-teal-500/50 transition-colors group relative overflow-hidden">
                                            {job.isRecommended && (
                                                <div className="absolute top-0 right-0 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-xs px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    {job.matchPercentage}% Match
                                                </div>
                                            )}

                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-soft-100 to-soft-200 dark:from-navy-700 dark:to-navy-600 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-8 h-8 text-soft-400" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                        <h3 className="text-xl font-bold text-navy-800 dark:text-soft-100 group-hover:text-teal-600 transition-colors">
                                                            {job.position}
                                                        </h3>
                                                        {job.type && (
                                                            <span className="badge badge-teal self-start md:self-auto uppercase text-xs tracking-wider">
                                                                {job.type}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-base font-medium text-soft-600 dark:text-soft-300 mb-4">
                                                        {job.company?.companyName || job.company}
                                                    </div>

                                                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-soft-500 dark:text-soft-400 mb-6">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {job.location}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <IndianRupee className="w-4 h-4" />
                                                            {job.salary}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            Apply by {formatDate(job.deadline)}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {job.skillsRequired?.map((skill, index) => (
                                                            <span key={index} className={`text-xs px-2 py-1 rounded border ${user?.skills?.some(s => s.name?.toLowerCase() === skill.toLowerCase()) ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-700 dark:text-teal-300' : 'bg-soft-50 border-soft-200 text-soft-600 dark:bg-navy-800 dark:border-navy-600 dark:text-soft-400'}`}>{skill}</span>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-end">
                                                        <button onClick={() => handleQuickApply(job)} className="btn btn-primary flex items-center gap-2">
                                                            Apply Now <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-soft-500">
                                    <Briefcase className="w-16 h-16 mb-4 opacity-20" />
                                    <h3 className="text-xl font-semibold mb-2">No new jobs found</h3>
                                    <p>You're all caught up! Check your applied jobs.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'applied' && (
                        <div className="animate-fade-in space-y-4">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <div key={app._id} className="card border-l-4 border-l-teal-500">
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-teal-50 dark:bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Building className="w-6 h-6 text-teal-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-navy-900 dark:text-white text-lg">
                                                        {app.job?.position || 'Unknown Position'}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {app.job?.company?.companyName || 'Unknown Company'}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(app.status)}`}>
                                                    {app.status === 'accepted' && <CheckCircle className="w-3.5 h-3.5" />}
                                                    {app.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' ')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p class="text-gray-500">You haven't applied to any jobs yet.</p>
                                    <button onClick={() => setActiveTab('new')} className="btn btn-link mt-2">Browse New Jobs</button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </PageWrapper>
    );
};

export default JobRecommendations;
