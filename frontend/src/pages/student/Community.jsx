import { useState, useEffect } from 'react';
import { communityAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import { Search, Filter, Linkedin, Github, Mail, User, Code2, Award, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Community = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        branch: 'All',
        skill: ''
    });

    const branches = [
        'All',
        'Computer Science', 'Information Technology', 'Electronics & Communication',
        'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
        'Chemical Engineering'
    ];

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCommunity();
        }, 500); // 500ms debounce for search
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const fetchCommunity = async () => {
        try {
            setLoading(true);
            const { data } = await communityAPI.getAll(filters);
            setStudents(data);
        } catch (error) {
            console.error('Error fetching community:', error);
            toast.error('Failed to load community members');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <PageWrapper>
            {/* Header & Search */}
            <div className="mb-8">
                <h1 className="page-title mb-4">Community & Alumni</h1>
                <div className="card p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                            <input
                                type="text"
                                placeholder="Search students by name..."
                                className="input pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="input"
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                            >
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                            <input
                                type="text"
                                placeholder="Filter by skill (e.g., React)..."
                                className="input pl-10"
                                value={filters.skill}
                                onChange={(e) => handleFilterChange('skill', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="card h-64 animate-pulse">
                            <div className="h-20 bg-soft-200 dark:bg-navy-600 rounded-lg mb-4"></div>
                            <div className="h-4 bg-soft-200 dark:bg-navy-600 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-soft-200 dark:bg-navy-600 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : students.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <div key={student._id} className="card card-hover group flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-soft-200 border-2 border-soft-300 dark:border-navy-500">
                                        {student.avatar ? (
                                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white font-bold text-lg">
                                                {student.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-navy-800 dark:text-soft-100 line-clamp-1">{student.name}</h3>
                                        <p className="text-sm text-soft-600 dark:text-soft-400 line-clamp-1">{student.branch}</p>
                                    </div>
                                </div>
                                <div className="badge badge-primary font-mono text-xs">
                                    {student.careerScore} pts
                                </div>
                            </div>

                            {student.bio && (
                                <p className="text-sm text-soft-600 dark:text-soft-400 mb-4 line-clamp-2 flex-grow">
                                    {student.bio}
                                </p>
                            )}

                            {student.skills?.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {student.skills.slice(0, 3).map((skill, i) => (
                                            <span key={i} className="badge badge-teal text-xs">
                                                {skill.name}
                                            </span>
                                        ))}
                                        {student.skills.length > 3 && (
                                            <span className="badge badge-teal text-xs">+{student.skills.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 mt-auto border-t border-soft-300 dark:border-navy-600 flex justify-between items-center">
                                <span className="text-xs text-soft-500">Year {student.year || 1} Student</span>
                                <div className="flex gap-2">
                                    {student.linkedin && (
                                        <a href={student.linkedin} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-soft-200 dark:hover:bg-navy-600 text-[#0077b5] transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {student.github && (
                                        <a href={student.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-soft-200 dark:hover:bg-navy-600 text-navy-900 dark:text-white transition-colors">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    <a href={`mailto:?subject=Connecting via SCMS&body=Hi ${student.name}, I saw your profile on SCMS.`} className="p-1.5 rounded-md hover:bg-soft-200 dark:hover:bg-navy-600 text-teal-600 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-soft-500">
                    <User className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-xl font-semibold mb-2">No students found</h3>
                    <p>Try adjusting your search or filters to find more people.</p>
                </div>
            )}
        </PageWrapper>
    );
};

export default Community;
