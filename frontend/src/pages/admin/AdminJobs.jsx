import { useState, useEffect } from 'react';
import { jobPostingsAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import { Plus, Trash2, Building2, MapPin, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        description: '',
        skillsRequired: '',
        location: '',
        type: 'Full-time',
        salary: '',
        applyLink: '',
        deadline: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await jobPostingsAPI.getAll();
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await jobPostingsAPI.delete(id);
            setJobs(jobs.filter(job => job._id !== id));
            toast.success('Job deleted successfully');
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await jobPostingsAPI.create(formData);
            toast.success('Job posted successfully');
            setShowModal(false);
            setFormData({
                company: '', position: '', description: '',
                skillsRequired: '', location: '', type: 'Full-time',
                salary: '', applyLink: '', deadline: ''
            });
            fetchJobs();
        } catch (error) {
            toast.error('Failed to post job');
        }
    };

    return (
        <PageWrapper>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Manage Jobs</h1>
                    <p className="text-soft-600 dark:text-soft-400">Post and manage job opportunities</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Post New Job
                </button>
            </div>

            {/* Jobs List */}
            <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm overflow-hidden border border-soft-200 dark:border-navy-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-soft-50 dark:bg-navy-700 text-soft-600 dark:text-soft-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Company</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Posted Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-soft-200 dark:divide-navy-600">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-soft-500">Loading jobs...</td></tr>
                            ) : jobs.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-soft-500">No jobs posted yet</td></tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-soft-50 dark:hover:bg-navy-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-navy-800 dark:text-soft-100">{job.company}</td>
                                        <td className="px-6 py-4 text-soft-600 dark:text-soft-300">{job.position}</td>
                                        <td className="px-6 py-4 text-soft-500 dark:text-soft-400">{job.location}</td>
                                        <td className="px-6 py-4"><span className="badge badge-teal">{job.type}</span></td>
                                        <td className="px-6 py-4 text-soft-500 dark:text-soft-400">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Job Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-soft-200 dark:border-navy-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white">Post New Job</h2>
                            <button onClick={() => setShowModal(false)} className="text-soft-500 hover:text-navy-700 dark:hover:text-soft-200">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Company Name</label>
                                    <input type="text" className="input" required
                                        value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Position / Role</label>
                                    <input type="text" className="input" required
                                        value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="label">Job Description</label>
                                <textarea className="input min-h-[100px]" required
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Location</label>
                                    <input type="text" className="input" required placeholder="e.g. Bangalore"
                                        value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Salary Range</label>
                                    <input type="text" className="input" placeholder="e.g. 10 LPA"
                                        value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Job Type</label>
                                    <select className="input"
                                        value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Application Deadline</label>
                                    <input type="date" className="input" required
                                        value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="label">Skills Required (comma separated)</label>
                                <input type="text" className="input" placeholder="React, Node.js, Python" required
                                    value={formData.skillsRequired} onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })} />
                            </div>

                            <div>
                                <label className="label">Application Link / Email</label>
                                <input type="text" className="input" placeholder="https://..." required
                                    value={formData.applyLink} onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Post Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default AdminJobs;
