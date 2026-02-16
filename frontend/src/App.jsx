import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterChoice from './pages/auth/RegisterChoice';
import Register from './pages/auth/Register';
import EmployerRegister from './pages/auth/EmployerRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Toast from './components/ui/Toast';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Projects from './pages/student/Projects';
import Internships from './pages/student/Internships';
import Jobs from './pages/student/Jobs';
import Skills from './pages/student/Skills';
import Certificates from './pages/student/Certificates';
import Community from './pages/student/Community';
import JobRecommendations from './pages/student/JobRecommendations';
import Resume from './pages/student/Resume';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsList from './pages/admin/StudentsList';
import AdminJobs from './pages/admin/AdminJobs';
import Rankings from './pages/admin/Rankings';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminImport from './pages/admin/AdminImport';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerJobs from './pages/employer/EmployerJobs';
import CreateJob from './pages/employer/CreateJob';
import EditJob from './pages/employer/EditJob';
import JobApplicants from './pages/employer/JobApplicants';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, employerOnly = false }) => {
    const { isAuthenticated, isAdmin, isEmployer, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-300 dark:bg-navy-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (employerOnly && !isEmployer) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, isEmployer, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-300 dark:bg-navy-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        if (isEmployer) return <Navigate to="/employer" replace />;
        return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
    }

    return children;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Landing Pages */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterChoice /></PublicRoute>} />
            <Route path="/register/student" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/register/employer" element={<PublicRoute><EmployerRegister /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Student Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
            </Route>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="profile" element={<Profile />} />
                <Route path="projects" element={<Projects />} />
                <Route path="internships" element={<Internships />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="skills" element={<Skills />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="community" element={<Community />} />
                <Route path="jobs-available" element={<JobRecommendations />} />
                <Route path="resume" element={<Resume />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Layout isAdmin /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="rankings" element={<Rankings />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="imports" element={<AdminImport />} />
            </Route>

            {/* Employer Protected RoisAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/
            <Route path="/employer" element={<ProtectedRoute employerOnly><Layout isEmployer /></ProtectedRoute>}>
                <Route index element={<EmployerDashboard />} />
                <Route path="profile" element={<EmployerProfile />} />
                <Route path="jobs" element={<EmployerJobs />} />
                <Route path="jobs/create" element={<CreateJob />} />
                <Route path="jobs/:id/edit" element={<EditJob />} />
                <Route path="jobs/:id/applicants" element={<JobApplicants />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

import SplashScreen from './components/ui/SplashScreen';
import { useState, useEffect } from 'react';

import IntroVideo from './components/ui/IntroVideo';

// ... (existing imports)

function App() {
    const [showIntro, setShowIntro] = useState(false);
    const [showSplash, setShowSplash] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

        if (!hasSeenIntro) {
            // First visit in this session: Show Video
            setShowIntro(true);
        } else {
            // Refresh/Subsequent visit: Show Splash
            setShowSplash(true);
        }
    }, []);

    const handleIntroComplete = () => {
        sessionStorage.setItem('hasSeenIntro', 'true');
        setShowIntro(false);
        setIsAppReady(true);
    };

    const handleSplashComplete = () => {
        setShowSplash(false);
        setIsAppReady(true);
    };

    return (
        <AuthProvider>
            {showIntro && <IntroVideo onComplete={handleIntroComplete} />}

            {showSplash && !showIntro && <SplashScreen onComplete={handleSplashComplete} />}

            {isAppReady && (
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppRoutes />
                    <Toast />
                </BrowserRouter>
            )}

            {/* Fallback to render nothing while resolving logic if needed, or default to Splash */}
            {!showIntro && !showSplash && !isAppReady && null}
        </AuthProvider>
    );
}

export default App;
