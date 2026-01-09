import { useState, useEffect } from 'react';
import { internshipsAPI } from '../../services/api';
import { Briefcase, Plus, Edit2, Trash2, MapPin, Calendar, X, Building } from 'lucide-react';

const Internships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        company: '', role: '', description: '', location: '', locationType: 'onsite',
        startDate: '', endDate: '', stipend: '', certificateUrl: '', isCurrentlyWorking: false
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await internshipsAPI.getAll();
            setInternships(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, stipend: formData.stipend ? parseFloat(formData.stipend) : null };
            if (editingItem) {
                await internshipsAPI.update(editingItem._id, payload);
            } else {
                await internshipsAPI.create(payload);
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this internship?')) {
            try { await internshipsAPI.delete(id); fetchData(); } catch (e) { console.error(e); }
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            company: item.company, role: item.role, description: item.description || '',
            location: item.location || '', locationType: item.locationType || 'onsite',
            startDate: item.startDate?.split('T')[0] || '', endDate: item.endDate?.split('T')[0] || '',
            stipend: item.stipend || '', certificateUrl: item.certificateUrl || '',
            isCurrentlyWorking: item.isCurrentlyWorking || false
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ company: '', role: '', description: '', location: '', locationType: 'onsite', startDate: '', endDate: '', stipend: '', certificateUrl: '', isCurrentlyWorking: false });
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">Internships</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Internship</button>
            </div>

            {internships.length === 0 ? (
                <div className="card text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                    <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">No internships yet</h2>
                    <p className="text-soft-600 dark:text-soft-400 mb-4">Add your internship experiences</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Internship</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {internships.map((item) => (
                        <div key={item._id} className="card card-hover">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-navy-800 dark:text-soft-100">{item.role}</h3>
                                        <p className="text-teal-600 dark:text-teal-400">{item.company}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-soft-600 dark:text-soft-400">
                                            {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>}
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(item.startDate)} - {item.isCurrentlyWorking ? 'Present' : formatDate(item.endDate)}</span>
                                            {item.duration && <span className="badge badge-teal">{item.duration} months</span>}
                                            <span className={`badge ${item.locationType === 'remote' ? 'badge-success' : item.locationType === 'hybrid' ? 'badge-warning' : 'badge-primary'}`}>{item.locationType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end md:self-center">
                                    <button onClick={() => openEditModal(item)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><Edit2 className="w-4 h-4 text-soft-600 dark:text-soft-400" /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </div>
                            {item.description && <p className="mt-3 text-sm text-soft-600 dark:text-soft-400 pl-16">{item.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-navy-700 p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">{editingItem ? 'Edit Internship' : 'Add Internship'}</h2>
                            <button onClick={closeModal} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Company *</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input" required /></div>
                                <div><label className="label">Role *</label><input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input" required /></div>
                            </div>
                            <div><label className="label">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[80px]" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input" /></div>
                                <div><label className="label">Type</label><select value={formData.locationType} onChange={(e) => setFormData({ ...formData, locationType: e.target.value })} className="input"><option value="onsite">Onsite</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Start Date *</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input" required /></div>
                                <div><label className="label">End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input" disabled={formData.isCurrentlyWorking} /></div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isCurrentlyWorking} onChange={(e) => setFormData({ ...formData, isCurrentlyWorking: e.target.checked })} className="w-4 h-4 rounded border-soft-400" /><span className="text-sm text-navy-600 dark:text-soft-400">Currently working here</span></label>
                            <div><label className="label">Stipend (per month)</label><input type="number" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} className="input" placeholder="₹10000" /></div>
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

export default Internships;
