import { useState, useEffect } from 'react';
import { jobsAPI, applicationAPI } from '../../services/api';
import { GraduationCap, Plus, Edit2, Trash2, MapPin, Calendar, X, Building, ExternalLink, Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';

const Jobs = () => {
    const [activeTab, setActiveTab] = useState('portal'); // 'portal' or 'tracker'
    const [jobs, setJobs] = useState([]); // Manual tracker jobs
    const [applications, setApplications] = useState([]); // System applications
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        company: '', position: '', location: '', locationType: 'onsite', salary: '',
        jobType: 'full-time', status: 'applied', appliedDate: '', jobUrl: '', notes: ''
    });

    useEffect(() => {
        fetchData();
        // Also fetch system applications if on that tab (or always)
        fetchApplications();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await jobsAPI.getAll();
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await applicationAPI.getMyApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await jobsAPI.update(editingItem._id, formData);
            } else {
                await jobsAPI.create(formData);
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job application?')) {
            try { await jobsAPI.delete(id); fetchData(); } catch (e) { console.error(e); }
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            company: item.company, position: item.position, location: item.location || '',
            locationType: item.locationType || 'onsite', salary: item.salary || '',
            jobType: item.jobType || 'full-time', status: item.status,
            appliedDate: item.appliedDate?.split('T')[0] || '', jobUrl: item.jobUrl || '', notes: item.notes || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ company: '', position: '', location: '', locationType: 'onsite', salary: '', jobType: 'full-time', status: 'applied', appliedDate: '', jobUrl: '', notes: '' });
    };

    const getStatusBadge = (status) => {
        const styles = {
            applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'under-review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            interviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            offered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
            rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            withdrawn: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
        return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="page-title">My Applications</h1>
                    <p className="text-soft-600 dark:text-soft-400">Track and manage your job applications</p>
                </div>
                {activeTab === 'tracker' && (
                    <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Manual Entry</button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-navy-700 mb-6">
                <button
                    onClick={() => setActiveTab('portal')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'portal'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <Briefcase className="w-4 h-4" />
                    Portal Applications
                    <span className="bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 px-2 rounded-full text-xs">
                        {applications.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('tracker')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tracker'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    External Tracker
                    <span className="bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 px-2 rounded-full text-xs">
                        {jobs.length}
                    </span>
                </button>
            </div>

            {activeTab === 'portal' ? (
                // Portal Applications List (Automatic)
                applications.length === 0 ? (
                    <div className="card text-center py-12">
                        <Briefcase className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                        <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">No applications yet</h2>
                        <p className="text-soft-600 dark:text-soft-400 mb-4">You haven't applied to any jobs via the portal.</p>
                        <a href="/jobs-available" className="btn btn-primary">Find Jobs</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div key={app._id} className="card hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-teal-50 dark:bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {app.job?.company?.logo ? (
                                                <img src={app.job.company.logo} alt="" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <Building className="w-6 h-6 text-teal-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-navy-900 dark:text-white text-lg">
                                                {app.job?.position || 'Unknown Position'}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {app.job?.company?.companyName || 'Unknown Company'}
                                                <span className="mx-2">•</span>
                                                {app.job?.location}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                </span>
                                                {app.job?.type && (
                                                    <span className="bg-gray-100 dark:bg-navy-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 text-xs">
                                                        {app.job.type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 self-end md:self-center">
                                        <div className="text-right">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(app.status)}`}>
                                                {app.status === 'accepted' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {app.status === 'rejected' && <X className="w-3.5 h-3.5" />}
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' ')}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Updated {new Date(app.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                // External Tracker List (Manual)
                jobs.length === 0 ? (
                    <div className="card text-center py-12">
                        <FileText className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                        <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">Track applications manually</h2>
                        <p className="text-soft-600 dark:text-soft-400 mb-4">Keep track of jobs applied outside this platform</p>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Entry</button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map((item) => (
                            <div key={item._id} className="card card-hover">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-navy-800 dark:text-soft-100">{item.position}</h3>
                                                <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                                            </div>
                                            <p className="text-teal-600 dark:text-teal-400">{item.company}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-soft-600 dark:text-soft-400">
                                                {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>}
                                                {item.appliedDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Applied {new Date(item.appliedDate).toLocaleDateString()}</span>}
                                                {item.salary && <span className="badge badge-teal">{item.salary}</span>}
                                                <span className="badge badge-primary">{item.jobType}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        {item.jobUrl && <a href={item.jobUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><ExternalLink className="w-4 h-4 text-soft-600 dark:text-soft-400" /></a>}
                                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><Edit2 className="w-4 h-4 text-soft-600 dark:text-soft-400" /></button>
                                        <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                </div>
                                {item.notes && <p className="mt-3 text-sm text-soft-600 dark:text-soft-400 pl-16 italic">"{item.notes}"</p>}
                            </div>
                        ))}
                    </div>
                )
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-navy-700 p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">{editingItem ? 'Edit Application' : 'Add Application'}</h2>
                            <button onClick={closeModal} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Company *</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input" required /></div>
                                <div><label className="label">Position *</label><input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input" required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input" /></div>
                                <div><label className="label">Type</label><select value={formData.locationType} onChange={(e) => setFormData({ ...formData, locationType: e.target.value })} className="input"><option value="onsite">Onsite</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option></select></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="label">Job Type</label><select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} className="input"><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="freelance">Freelance</option></select></div>
                                <div><label className="label">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input"><option value="applied">Applied</option><option value="interviewing">Interviewing</option><option value="offered">Offered</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="withdrawn">Withdrawn</option></select></div>
                                <div><label className="label">Applied Date</label><input type="date" value={formData.appliedDate} onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })} className="input" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Salary</label><input type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="input" placeholder="₹10-15 LPA" /></div>
                                <div><label className="label">Job URL</label><input type="url" value={formData.jobUrl} onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })} className="input" /></div>
                            </div>
                            <div><label className="label">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input min-h-[60px]" placeholder="Any notes about this application..." /></div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingItem ? 'Save' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
