import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, User, Briefcase, FileText,
    LogOut, Menu, X, ChevronRight, Award,
    TrendingUp, Users, FolderKanban, Bell, UploadCloud,
    Globe, Code2, Trophy, Building2, GraduationCap, Sun, Moon
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ isAdmin = false, isEmployer = false }) => {
    const { user, logout, darkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentNavItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/jobs-available', icon: Globe, label: 'The Opportunity Hub' }, // Merged Jobs & Internships
        { path: '/jobs', icon: Briefcase, label: 'My Applications' },
        { path: '/skills', icon: Code2, label: 'Skill Compass' },
        { path: '/resume', icon: FileText, label: 'Resume Architect' },
        { path: '/projects', icon: Trophy, label: 'Milestone Tracker' }, // Merged Projects & Certificates
        { path: '/community', icon: Users, label: 'Community' },
    ];

    const adminNavItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/students', icon: Users, label: 'Students' },
        { path: '/admin/jobs', icon: Briefcase, label: 'Manage Jobs' },
        { path: '/admin/rankings', icon: TrendingUp, label: 'Placement Radar' },
        { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
        { path: '/admin/imports', icon: UploadCloud, label: 'Bulk Import' }
    ];

    const employerNavItems = [
        { path: '/employer', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employer/profile', icon: Building2, label: 'Company Profile' },
        { path: '/employer/jobs', icon: Briefcase, label: 'My Job Postings' },
        { path: '/employer/jobs/create', icon: GraduationCap, label: 'Post a Job' },
    ];

    const navItems = isAdmin ? adminNavItems : isEmployer ? employerNavItems : studentNavItems;

    return (
        <div className="h-screen overflow-hidden bg-soft-300 dark:bg-navy-800 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-navy-700 shadow-soft
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-soft-400 dark:border-navy-600">
                        <div className="flex items-center gap-3">
                            <img src="/logo-primary.png" alt="ZONAVI" className="h-20 w-auto" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin' || item.path === '/employer'}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-gradient-to-r from-navy-500 to-teal-500 text-white shadow-md'
                                        : 'text-navy-600 dark:text-soft-400 hover:bg-soft-200 dark:hover:bg-navy-600'
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-soft-400 dark:border-navy-600">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-navy-800 dark:text-soft-100 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-soft-600 dark:text-soft-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={toggleDarkMode}
                                className="flex-1 btn btn-ghost flex items-center justify-center gap-2"
                            >
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 btn btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-navy-700 shadow-soft px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"
                    >
                        <Menu className="w-6 h-6 text-navy-600 dark:text-soft-300" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/logo-primary.png" alt="ZONAVI" className="h-6 w-auto" />
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-soft-300" /> : <Moon className="w-5 h-5 text-navy-600" />}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
