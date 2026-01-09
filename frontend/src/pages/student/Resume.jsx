import { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI, internshipsAPI, skillsAPI, certificatesAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import ClassicTemplate from '../../components/resume/ClassicTemplate';
import ModernTemplate from '../../components/resume/ModernTemplate';
import MinimalTemplate from '../../components/resume/MinimalTemplate';
import ProfessionalTemplate from '../../components/resume/ProfessionalTemplate';
import { FileDown, Loader2, Layout } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Resume = () => {
    const { user } = useAuth();
    const [data, setData] = useState({
        projects: [],
        internships: [],
        skills: [],
        certificates: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState('professional');

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const [projectsRes, internshipsRes, skillsRes, certificatesRes] = await Promise.all([
                    projectsAPI.getAll(),
                    internshipsAPI.getAll(),
                    skillsAPI.getAll(),
                    certificatesAPI.getAll()
                ]);

                setData({
                    projects: projectsRes.data,
                    internships: internshipsRes.data,
                    skills: skillsRes.data,
                    certificates: certificatesRes.data
                });
            } catch (error) {
                console.error('Error fetching resume data:', error);
                toast.error('Failed to load resume data');
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    const getTemplate = () => {
        const props = {
            user,
            projects: data.projects,
            internships: data.internships,
            skills: data.skills,
            certificates: data.certificates
        };

        switch (selectedTemplate) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'professional': return <ProfessionalTemplate {...props} />;
            default: return <ClassicTemplate {...props} />;
        }
    };

    const templates = [
        { id: 'professional', name: 'Professional', color: 'bg-indigo-600', desc: 'Academic / TeX Style' },
        { id: 'classic', name: 'Classic', color: 'bg-blue-500', desc: 'Traditional' },
        { id: 'modern', name: 'Modern', color: 'bg-teal-500', desc: 'Sidebar Layout' },
        { id: 'minimal', color: 'bg-gray-800', name: 'Minimal', desc: 'Clean B&W' },
    ];

    return (
        <PageWrapper className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="page-title">Resume Architect</h1>
                    <p className="text-soft-600 dark:text-soft-400 mt-1">
                        Choose a template and download your ATS-friendly resume
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-soft-100 dark:bg-navy-700 p-1 rounded-lg">
                        {templates.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${selectedTemplate === t.id
                                    ? 'bg-white dark:bg-navy-600 shadow-sm text-navy-800 dark:text-white'
                                    : 'text-soft-500 hover:text-navy-700 dark:hover:text-soft-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${t.color}`} />
                                {t.name}
                            </button>
                        ))}
                    </div>

                    <PDFDownloadLink
                        document={getTemplate()}
                        fileName={`${user?.name?.replace(/\s+/g, '_')}_${selectedTemplate}_Resume.pdf`}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        {({ loading }) => (
                            <>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                {loading ? 'Generating...' : 'Download PDF'}
                            </>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            <div className="flex-1 bg-soft-200 dark:bg-navy-800 rounded-xl overflow-hidden shadow-elevated border border-soft-300 dark:border-navy-600 relative">
                <PDFViewer width="100%" height="100%" className="w-full h-full border-none">
                    {getTemplate()}
                </PDFViewer>
            </div>
        </PageWrapper>
    );
};

export default Resume;
