import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, FolderKanban, Briefcase, GraduationCap, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const { data } = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    const statCards = [
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: 'from-purple-500 to-purple-600' },
        { label: 'Total Internships', value: stats?.totalInternships || 0, icon: Briefcase, color: 'from-orange-500 to-orange-600' },
        { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: GraduationCap, color: 'from-green-500 to-green-600' },
        { label: 'Placement Rate', value: `${stats?.placementRate || 0}%`, icon: CheckCircle, color: 'from-teal-500 to-teal-600' },
        { label: 'Avg CGPA', value: stats?.avgCgpa || 0, icon: TrendingUp, color: 'from-pink-500 to-pink-600' },
    ];

    const jobStatusData = stats?.jobStats ? Object.entries(stats.jobStats).map(([name, value]) => ({ name, value })).filter(d => d.value > 0) : [];
    const branchData = stats?.branchStats?.slice(0, 6) || [];
    const skillData = stats?.topSkills || [];
    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6'];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="card bg-gradient-to-r from-navy-500 to-teal-500 text-white">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-soft-200 mt-1">Overview of all student activities and statistics</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="card">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-navy-800 dark:text-soft-100">{stat.value}</div>
                        <div className="text-sm text-soft-600 dark:text-soft-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="section-title mb-4">Job Application Status</h2>
                    {jobStatusData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={jobStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                        {jobStatusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <div className="h-64 flex items-center justify-center text-soft-500">No data available</div>}
                </div>

                <div className="card">
                    <h2 className="section-title mb-4">Students by Branch</h2>
                    {branchData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={branchData} layout="vertical">
                                    <XAxis type="number" />
                                    <YAxis dataKey="_id" type="category" width={100} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3d8b8b" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <div className="h-64 flex items-center justify-center text-soft-500">No data available</div>}
                </div>

                <div className="card lg:col-span-2">
                    <h2 className="section-title mb-4">Top Skills in Demand</h2>
                    {skillData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillData}>
                                    <XAxis dataKey="_id" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <div className="h-64 flex items-center justify-center text-soft-500">No data available</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
