import { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI, internshipsAPI, skillsAPI, certificatesAPI, authAPI } from '../../services/api';
import ClassicTemplate from '../../components/resume/ClassicTemplate';
import ModernTemplate from '../../components/resume/ModernTemplate';
import MinimalTemplate from '../../components/resume/MinimalTemplate';
import ProfessionalTemplate from '../../components/resume/ProfessionalTemplate';
import ResumeEditor from '../../components/resume/ResumeEditor';
import EditorModal from '../../components/resume/EditorModal';
import {
    FileDown, Loader2, RefreshCw, RotateCcw, Save,
    ChevronLeft, Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const RESUME_DRAFT_KEY = 'scms_resume_draft';

const Resume = () => {
    const { user } = useAuth();

    // Initialize with empty structure
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            name: '', email: '', phone: '', linkedin: '', github: '', bio: '',
            branch: '', year: '', cgpa: '', location: ''
        },
        projects: [],
        internships: [],
        skills: [],
        certificates: []
    });
    const [previewData, setPreviewData] = useState(null); // Data committed for preview
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            if (!user) return;

            try {
                const [projectsRes, internshipsRes, skillsRes, certificatesRes] = await Promise.all([
                    projectsAPI.getAll(),
                    internshipsAPI.getAll(),
                    skillsAPI.getAll(),
                    certificatesAPI.getAll()
                ]);

                const initialData = {
                    personalInfo: {
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        branch: user.branch || '',
                        year: user.year || '',
                        cgpa: user.cgpa || '',
                        linkedin: user.linkedin || '',
                        github: user.github || '',
                        bio: user.bio || '',
                        location: user.location || ''
                    },
                    projects: projectsRes.data || [],
                    internships: internshipsRes.data || [],
                    skills: skillsRes.data || [],
                    certificates: certificatesRes.data || []
                };

                // Check for saved draft
                const savedDraft = localStorage.getItem(RESUME_DRAFT_KEY);
                if (savedDraft) {
                    try {
                        const parsedDraft = JSON.parse(savedDraft);
                        setResumeData(parsedDraft);
                        setPreviewData(parsedDraft);
                        toast('Loaded saved draft', { icon: '📂' });
                    } catch (e) {
                        console.error('Failed to parse draft', e);
                        setResumeData(initialData);
                        setPreviewData(initialData);
                    }
                } else {
                    setResumeData(initialData);
                    setPreviewData(initialData);
                }
            } catch (error) {
                console.error('Error fetching resume data:', error);
                toast.error('Failed to load resume data');
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [user]);

    // Auto-save draft
    useEffect(() => {
        if (!loading && resumeData) {
            localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(resumeData));
        }
    }, [resumeData, loading]);

    const handleReset = async () => {
        if (!window.confirm('Are you sure? This will discard your current changes and reload from your profile.')) return;

        localStorage.removeItem(RESUME_DRAFT_KEY);
        setLoading(true);
        window.location.reload();
    };

    // Helper to sync entities (Create/Update/Delete)
    const syncDetails = async (api, currentList) => {
        const response = await api.getAll();
        const existingItems = response.data || [];
        const existingIds = existingItems.map(item => item._id);
        const currentIds = currentList.map(item => item._id).filter(id => id);

        const toDeleteIds = existingIds.filter(id => !currentIds.includes(id));
        await Promise.all(toDeleteIds.map(id => api.delete(id)));

        const syncedItems = await Promise.all(currentList.map(async (item) => {
            if (item._id && existingIds.includes(item._id)) {
                const { _id, createdAt, updatedAt, __v, ...updateData } = item;
                const res = await api.update(_id, updateData);
                return res.data;
            } else {
                const { _id, ...createData } = item;
                const res = await api.create(createData);
                return res.data;
            }
        }));
        return syncedItems;
    };

    const handleSaveProfile = async () => {
        if (!window.confirm('This will update your permanent profile and save all project/internship details to the database. Continue?')) return;

        setSaving(true);
        const toastId = toast.loading('Saving to profile...');

        try {
            await authAPI.updateProfile(resumeData.personalInfo);

            const [syncedProjects, syncedInternships, syncedSkills, syncedCertificates] = await Promise.all([
                syncDetails(projectsAPI, resumeData.projects),
                syncDetails(internshipsAPI, resumeData.internships),
                syncDetails(skillsAPI, resumeData.skills),
                syncDetails(certificatesAPI, resumeData.certificates)
            ]);

            const newData = {
                ...resumeData,
                projects: syncedProjects,
                internships: syncedInternships,
                skills: syncedSkills,
                certificates: syncedCertificates
            };

            setResumeData(newData);
            setPreviewData(newData);
            localStorage.removeItem(RESUME_DRAFT_KEY);

            toast.success('Profile and Resume updated successfully!', { id: toastId });
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Failed to save profile. Please try again.', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-soft-50 dark:bg-navy-900">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    const getTemplate = (dataToUse = previewData) => {
        if (!dataToUse) return null;

        const props = {
            user: dataToUse.personalInfo,
            projects: dataToUse.projects,
            internships: dataToUse.internships,
            skills: dataToUse.skills,
            certificates: dataToUse.certificates
        };

        switch (selectedTemplate) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'professional': return <ProfessionalTemplate {...props} />;
            default: return <ClassicTemplate {...props} />;
        }
    };

    const templates = [
        { id: 'modern', name: 'Modern', color: 'bg-teal-500' },
        { id: 'professional', name: 'Professional', color: 'bg-indigo-600' },
        { id: 'classic', name: 'Classic', color: 'bg-blue-500' },
        { id: 'minimal', name: 'Minimal', color: 'bg-gray-800' },
    ];

    return (
        <div className="flex flex-col h-screen bg-soft-100 dark:bg-navy-950 overflow-hidden font-sans">
            {/* 1. Header Bar */}
            <header className="h-16 bg-white dark:bg-navy-900 border-b border-soft-200 dark:border-navy-800 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-soft-100 dark:hover:bg-navy-800 rounded-full text-soft-500 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            RA
                        </div>
                        <div>
                            <h1 className="font-bold text-navy-900 dark:text-white text-lg leading-tight">Resume Architect</h1>
                            <p className="text-xs text-soft-500 dark:text-soft-400">Untitled Resume</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="p-2.5 text-soft-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors tooltip"
                        title="Reset to Profile Data"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <div className="h-8 w-px bg-soft-200 dark:bg-navy-700 mx-1"></div>

                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-navy-900 dark:bg-white text-white dark:text-navy-900 hover:opacity-90 rounded-lg font-medium transition-all shadow-lg shadow-navy-900/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save to Profile</span>
                    </button>

                    <PDFDownloadLink
                        document={getTemplate(previewData)}
                        fileName={`${previewData?.personalInfo?.name?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-teal-500/20"
                    >
                        {({ loading }) => (
                            <>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                <span>Download</span>
                            </>
                        )}
                    </PDFDownloadLink>
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar (Editor) */}
                <div
                    className={`
                        bg-white dark:bg-navy-900 border-r border-soft-200 dark:border-navy-800 
                        flex flex-col transition-all duration-300 ease-in-out z-10
                        ${isSidebarOpen ? 'w-[400px]' : 'w-0 opacity-0'}
                    `}
                >
                    <div className="p-4 border-b border-soft-200 dark:border-navy-800 flex items-center justify-between shrink-0">
                        <h2 className="font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                            <Settings size={18} className="text-teal-500" />
                            Editor
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-4">
                            <ResumeEditor
                                data={resumeData}
                                onSectionSelect={setActiveSection}
                            />
                        </div>
                    </div>
                </div>

                {/* Toggle Sidebar Button (Float) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                        absolute top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-navy-800 border border-soft-200 dark:border-navy-700 
                        shadow-md p-1.5 rounded-full text-soft-500 hover:text-teal-600 transition-all
                        ${isSidebarOpen ? 'left-[388px]' : 'left-4'}
                    `}
                >
                    <ChevronLeft size={16} className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
                </button>

                {/* Preview Stage */}
                <div className="flex-1 bg-soft-100 dark:bg-navy-950 flex flex-col min-w-0">

                    {/* Toolbar */}
                    <div className="h-14 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-soft-200 dark:border-navy-800 flex items-center justify-center relative px-6 shrink-0">
                        {/* Template Selector */}
                        <div className="flex items-center gap-1 bg-soft-100 dark:bg-navy-800 p-1 rounded-lg">
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`
                                        px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2
                                        ${selectedTemplate === t.id
                                            ? 'bg-white dark:bg-navy-700 shadow-sm text-navy-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-soft-500 hover:text-navy-700 dark:hover:text-soft-200'
                                        }
                                    `}
                                >
                                    <div className={`w-2 h-2 rounded-full ${t.color}`} />
                                    {t.name}
                                </button>
                            ))}
                        </div>

                        {/* Right Tools */}
                        <div className="absolute right-6 flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setPreviewData(resumeData);
                                    toast.success('Preview refreshed', { icon: '⚡' });
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-navy-800 hover:bg-soft-50 dark:hover:bg-navy-700 border border-soft-200 dark:border-navy-700 rounded-lg text-xs font-medium text-navy-700 dark:text-soft-200 transition-all shadow-sm"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                Refresh Preview
                            </button>
                        </div>
                    </div>

                    {/* PDF Container */}
                    <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
                        <div
                            className="bg-white shadow-2xl shadow-navy-900/10 transition-transform duration-300 ease-out origin-top"
                            style={{ width: '800px', height: '1132px' }} // Standard A4 Aspect Ratio approx
                        >
                            <PDFViewer width="100%" height="100%" className="border-none w-full h-full">
                                {getTemplate()}
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Modal - Rendered at Root */}
            <EditorModal
                activeSection={activeSection}
                onClose={() => setActiveSection(null)}
                data={resumeData}
                onChange={(newData) => {
                    setResumeData(newData);
                    // Optional: update preview on close or debounce
                }}
            />
        </div>
    );
};

export default Resume;
