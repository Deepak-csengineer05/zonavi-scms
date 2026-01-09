import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import { Briefcase, Users, Eye, TrendingUp, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageWrapper from '../../components/ui/PageWrapper';

const EmployerDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await employerAPI.getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Jobs', value: analytics?.totalJobs || 0, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
        { label: 'Active Jobs', value: analytics?.activeJobs || 0, icon: TrendingUp, color: 'from-green-500 to-green-600' },
        { label: 'Applications', value: analytics?.totalApplications || 0, icon: Users, color: 'from-purple-500 to-purple-600' },
        { label: 'Total Views', value: analytics?.totalViews || 0, icon: Eye, color: 'from-orange-500 to-orange-600' },
    ];

    const applicationStatusData = analytics?.applicationsByStatus ? Object.entries(analytics.applicationsByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: count,
        color: {
            applied: '#3b82f6',
            'under-review': '#f59e0b',
            shortlisted: '#10b981',
            rejected: '#ef4444',
            accepted: '#06b6d4'
        }[status]
    })) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <PageWrapper className="space-y-6">
            {/* Welcome Header */}
            <div className="card bg-gradient-to-r from-navy-500 to-teal-500 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
                        <p className="text-soft-200 mt-1">Manage your job postings and track applicants</p>
                    </div>
                    <Link
                        to="/employer/jobs/create"
                        className="btn bg-white text-navy-500 hover:bg-soft-100 flex items-center gap-2 w-fit"
                    >
                        <Plus className="w-5 h-5" />
                        Post New Job
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2 text-navy-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Application Status Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">
                        Applications by Status
                    </h3>
                    {applicationStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={applicationStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {applicationStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            No applications yet
                        </div>
                    )}
                </div>

                {/* Recent Applicants */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">
                        Recent Applicants
                    </h3>
                    {analytics?.recentApplicants?.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {analytics.recentApplicants.map((applicant) => (
                                <div key={applicant._id} className="flex items-center gap-3 p-3 rounded-lg bg-soft-100 dark:bg-navy-800">
                                    <img
                                        src={applicant.student.avatar || `https://ui-avatars.com/api/?name=${applicant.student.name}`}
                                        alt={applicant.student.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-navy-900 dark:text-white truncate">
                                            {applicant.student.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {applicant.job.position} • {applicant.student.branch}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${applicant.status === 'shortlisted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            applicant.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {applicant.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            No applicants yet
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/employer/jobs" className="btn btn-primary">
                        Manage Jobs
                    </Link>
                    <Link to="/employer/profile" className="btn btn-secondary">
                        Edit Company Profile
                    </Link>
                    <Link to="/employer/jobs/create" className="btn bg-green-500 hover:bg-green-600 text-white">
                        Post New Job
                    </Link>
                </div>
            </div>
        </PageWrapper>
    );
};

export default EmployerDashboard;
