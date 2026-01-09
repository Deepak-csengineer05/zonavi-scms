import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Trash2, Eye, X, FolderKanban, Briefcase, GraduationCap, Award, Code2, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);

    useEffect(() => { fetchStudents(); }, [sortBy]);

    const fetchStudents = async () => {
        try {
            const { data } = await adminAPI.getStudents({ search, sortBy });
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchStudents();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this student and all their data? This cannot be undone.')) {
            try {
                await adminAPI.deleteStudent(id);
                fetchStudents();
            } catch (e) { console.error(e); }
        }
    };



    const handleExport = async () => {
        try {
            const response = await adminAPI.exportStudents();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export downloaded successfully');
        } catch (error) {
            toast.error('Failed to export students');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Importing students...');
        try {
            const { data } = await adminAPI.importStudents(formData);
            toast.success(data.message, { id: toastId });
            if (data.errors.length > 0) {
                console.error('Import errors:', data.errors);
                toast('Check console for import details', { icon: 'ℹ️' });
            }
            fetchStudents();
        } catch (error) {
            toast.error('Failed to import students', { id: toastId });
        } finally {
            e.target.value = null; // Reset input
        }
    };

    const viewStudent = async (id) => {
        try {
            const { data } = await adminAPI.getStudent(id);
            setStudentDetails(data);
            setSelectedStudent(id);
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">All Students</h1>
                <span className="badge badge-teal">{students.length} students</span>
            </div>

            <div className="card mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-500" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" placeholder="Search by name, username, or email..." />
                    </div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto">
                        <option value="">Sort by Recent</option>
                        <option value="name">Sort by Name</option>
                        <option value="cgpa">Sort by CGPA</option>
                        <option value="score">Sort by Career Score</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Search</button>
                    <div className="flex gap-2 ml-auto">
                        <button type="button" onClick={handleExport} className="btn btn-outline flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
                            <Upload className="w-4 h-4" /> Import CSV
                            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                        </label>
                    </div>
                </form>
            </div>

            {students.length === 0 ? (
                <div className="card text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                    <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200">No students found</h2>
                </div>
            ) : (
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-soft-200 dark:bg-navy-600">
                                <tr>
                                    <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Student</th>
                                    <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Branch</th>
                                    <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">CGPA</th>
                                    <th className="text-left p-4 font-medium text-navy-700 dark:text-soft-200">Career Score</th>
                                    <th className="text-right p-4 font-medium text-navy-700 dark:text-soft-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-soft-300 dark:divide-navy-600">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-soft-100 dark:hover:bg-navy-600/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-navy-800 dark:text-soft-100">{student.name}</p>
                                                    <p className="text-sm text-soft-600 dark:text-soft-400">@{student.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-soft-600 dark:text-soft-400">{student.branch || '-'}</td>
                                        <td className="p-4"><span className="badge badge-teal">{student.cgpa?.toFixed(2) || '0.00'}</span></td>
                                        <td className="p-4"><span className="badge badge-primary">{student.careerScore || 0}</span></td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => viewStudent(student._id)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><Eye className="w-4 h-4 text-soft-600 dark:text-soft-400" /></button>
                                                <button onClick={() => handleDelete(student._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Student Details Modal */}
            {selectedStudent && studentDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-navy-700 p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">Student Details</h2>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {studentDetails.student?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-navy-800 dark:text-soft-100">{studentDetails.student?.name}</h3>
                                    <p className="text-teal-600">@{studentDetails.student?.username}</p>
                                    <p className="text-sm text-soft-600 dark:text-soft-400">{studentDetails.student?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-soft-100 dark:bg-navy-600 rounded-lg">
                                    <p className="text-2xl font-bold text-navy-800 dark:text-soft-100">{studentDetails.student?.cgpa?.toFixed(2) || '0.00'}</p>
                                    <p className="text-sm text-soft-600 dark:text-soft-400">CGPA</p>
                                </div>
                                <div className="text-center p-3 bg-soft-100 dark:bg-navy-600 rounded-lg">
                                    <p className="text-2xl font-bold text-navy-800 dark:text-soft-100">{studentDetails.student?.careerScore || 0}</p>
                                    <p className="text-sm text-soft-600 dark:text-soft-400">Career Score</p>
                                </div>
                                <div className="text-center p-3 bg-soft-100 dark:bg-navy-600 rounded-lg">
                                    <p className="text-2xl font-bold text-navy-800 dark:text-soft-100">{studentDetails.student?.year || 1}</p>
                                    <p className="text-sm text-soft-600 dark:text-soft-400">Year</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-5 gap-3 text-center">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><FolderKanban className="w-5 h-5 mx-auto text-blue-600 mb-1" /><p className="text-lg font-bold text-navy-800 dark:text-soft-100">{studentDetails.projects?.length || 0}</p><p className="text-xs text-soft-600">Projects</p></div>
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><Briefcase className="w-5 h-5 mx-auto text-purple-600 mb-1" /><p className="text-lg font-bold text-navy-800 dark:text-soft-100">{studentDetails.internships?.length || 0}</p><p className="text-xs text-soft-600">Internships</p></div>
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg"><GraduationCap className="w-5 h-5 mx-auto text-orange-600 mb-1" /><p className="text-lg font-bold text-navy-800 dark:text-soft-100">{studentDetails.jobs?.length || 0}</p><p className="text-xs text-soft-600">Jobs</p></div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><Award className="w-5 h-5 mx-auto text-green-600 mb-1" /><p className="text-lg font-bold text-navy-800 dark:text-soft-100">{studentDetails.certificates?.length || 0}</p><p className="text-xs text-soft-600">Certs</p></div>
                                <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg"><Code2 className="w-5 h-5 mx-auto text-pink-600 mb-1" /><p className="text-lg font-bold text-navy-800 dark:text-soft-100">{studentDetails.skills?.length || 0}</p><p className="text-xs text-soft-600">Skills</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsList;
