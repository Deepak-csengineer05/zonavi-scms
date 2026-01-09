import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, projectsAPI, announcementsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    FolderKanban, Briefcase, GraduationCap, Award, Code2,
    TrendingUp, ArrowRight, Plus
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    LineChart, Line, CartesianGrid
} from 'recharts';
import PageWrapper from '../../components/ui/PageWrapper';
import AnnouncementCard from '../../components/ui/AnnouncementCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, projectsRes, announcementsRes] = await Promise.all([
                dashboardAPI.getStats(),
                projectsAPI.getAll(),
                announcementsAPI.getAll()
            ]);
            setStats(statsRes.data);
            setRecentProjects(projectsRes.data.slice(0, 3));
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Projects', value: stats?.projects || 0, icon: FolderKanban, color: 'from-blue-500 to-blue-600', path: '/projects' },
        { label: 'Internships', value: stats?.internships || 0, icon: Briefcase, color: 'from-purple-500 to-purple-600', path: '/internships' },
        { label: 'Job Applications', value: stats?.jobs || 0, icon: GraduationCap, color: 'from-orange-500 to-orange-600', path: '/jobs' },
        { label: 'Certificates', value: stats?.certificates || 0, icon: Award, color: 'from-green-500 to-green-600', path: '/certificates' },
        { label: 'Skills', value: stats?.skills || 0, icon: Code2, color: 'from-pink-500 to-pink-600', path: '/skills' },
    ];

    const jobChartData = stats?.jobStats ? [
        { name: 'Applied', value: stats.jobStats.applied || 0, color: '#3b82f6' },
        { name: 'Interviewing', value: stats.jobStats.interviewing || 0, color: '#f59e0b' },
        { name: 'Offered', value: stats.jobStats.offered || 0, color: '#10b981' },
        { name: 'Accepted', value: stats.jobStats.accepted || 0, color: '#06b6d4' },
        { name: 'Rejected', value: stats.jobStats.rejected || 0, color: '#ef4444' },
    ].filter(item => item.value > 0) : [];

    // Skill Stats Data
    const skillChartData = stats?.skillStats ? [
        { name: 'Beginner', value: stats.skillStats.Beginner || 0, color: '#3b82f6' },
        { name: 'Intermediate', value: stats.skillStats.Intermediate || 0, color: '#10b981' },
        { name: 'Advanced', value: stats.skillStats.Advanced || 0, color: '#8b5cf6' },
    ] : [];

    // History Data (format dates)
    const historyData = stats?.scoreHistory?.map(item => ({
        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: item.score
    })) || [];

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
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-soft-200 mt-1">Here's your career progress overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{stats?.careerScore || 0}</div>
                            <div className="text-soft-200 text-sm">Career Score</div>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{stats?.profileCompletion || 0}%</div>
                            <div className="text-soft-200 text-sm">Profile Complete</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        to={stat.path}
                        className="card card-hover group"
                    >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-navy-800 dark:text-soft-100">{stat.value}</div>
                        <div className="text-sm text-soft-600 dark:text-soft-400 flex items-center justify-between">
                            {stat.label}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Charts & Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Announcements Section - Full Width on Mobile, spans 2 cols if available */}
                {announcements.length > 0 && (
                    <div className="card lg:col-span-2">
                        <h2 className="section-title mb-4">Latest Announcements</h2>
                        <div className="space-y-2">
                            {announcements.map(announcement => (
                                <AnnouncementCard key={announcement._id} announcement={announcement} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Job Status Chart */}
                <div className="card">
                    <h2 className="section-title mb-4">Job Application Status</h2>
                    {jobChartData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={jobChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {jobChartData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-soft-500">
                            <GraduationCap className="w-12 h-12 mb-3 opacity-50" />
                            <p>No job applications yet</p>
                            <Link to="/jobs" className="btn btn-primary mt-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Job Application
                            </Link>
                        </div>
                    )}
                </div>

                {/* Skill Level Distribution */}
                <div className="card">
                    <h2 className="section-title mb-4">Skill Proficiency</h2>
                    {skillChartData.some(d => d.value > 0) ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillChartData}>
                                    <XAxis dataKey="name" stroke="#9aa5b4" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9aa5b4" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {skillChartData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-soft-500">
                            <Code2 className="w-12 h-12 mb-3 opacity-50" />
                            <p>No skills recorded yet</p>
                            <Link to="/skills" className="btn btn-primary mt-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Skills
                            </Link>
                        </div>
                    )}
                </div>

                {/* Career Score History */}
                <div className="card lg:col-span-2">
                    <h2 className="section-title mb-4">Career Growth</h2>
                    {historyData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e9ed" vertical={false} />
                                    <XAxis dataKey="date" stroke="#9aa5b4" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9aa5b4" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#0f2744"
                                        strokeWidth={3}
                                        dot={{ fill: '#0f2744', strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-soft-500">
                            <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
                            <p>Not enough history data yet</p>
                        </div>
                    )}
                </div>

                {/* Recent Projects */}
                <div className="card lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title">Recent Projects</h2>
                        <Link to="/projects" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recentProjects.length > 0 ? (
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <div key={project._id} className="p-4 bg-soft-200 dark:bg-navy-600 rounded-lg">
                                    <h3 className="font-medium text-navy-800 dark:text-soft-100">{project.title}</h3>
                                    <p className="text-sm text-soft-600 dark:text-soft-400 mt-1 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.technologies?.slice(0, 3).map((tech, idx) => (
                                            <span key={idx} className="badge badge-teal">{tech}</span>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <span className="badge badge-primary">+{project.technologies.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-soft-500">
                            <FolderKanban className="w-12 h-12 mb-3 opacity-50" />
                            <p>No projects yet</p>
                            <Link to="/projects" className="btn btn-primary mt-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Project
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="section-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link to="/projects" className="btn btn-outline flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> New Project
                    </Link>
                    <Link to="/internships" className="btn btn-outline flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> New Internship
                    </Link>
                    <Link to="/jobs" className="btn btn-outline flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> New Job App
                    </Link>
                    <Link to="/profile" className="btn btn-outline flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Update Profile
                    </Link>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard;
