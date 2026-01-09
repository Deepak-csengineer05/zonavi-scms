import { useState, useEffect } from 'react';
import { certificatesAPI } from '../../services/api';
import { Award, Plus, Edit2, Trash2, ExternalLink, Calendar, X } from 'lucide-react';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', skills: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await certificatesAPI.getAll();
            setCertificates(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
            if (editingItem) {
                await certificatesAPI.update(editingItem._id, payload);
            } else {
                await certificatesAPI.create(payload);
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this certificate?')) {
            try { await certificatesAPI.delete(id); fetchData(); } catch (e) { console.error(e); }
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title, issuer: item.issuer,
            issueDate: item.issueDate?.split('T')[0] || '',
            expiryDate: item.expiryDate?.split('T')[0] || '',
            credentialId: item.credentialId || '',
            credentialUrl: item.credentialUrl || '',
            skills: item.skills?.join(', ') || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', skills: '' });
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">Certificates</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Certificate</button>
            </div>

            {certificates.length === 0 ? (
                <div className="card text-center py-12">
                    <Award className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                    <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">No certificates yet</h2>
                    <p className="text-soft-600 dark:text-soft-400 mb-4">Add your achievements and certifications</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Certificate</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((item) => (
                        <div key={item._id} className="card card-hover">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-1">
                                    {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><ExternalLink className="w-4 h-4 text-soft-600 dark:text-soft-400" /></a>}
                                    <button onClick={() => openEditModal(item)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><Edit2 className="w-4 h-4 text-soft-600 dark:text-soft-400" /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-navy-800 dark:text-soft-100 mb-1">{item.title}</h3>
                            <p className="text-sm text-teal-600 dark:text-teal-400 mb-2">{item.issuer}</p>
                            <div className="flex items-center gap-2 text-xs text-soft-600 dark:text-soft-400 mb-3">
                                <Calendar className="w-3 h-3" /> {formatDate(item.issueDate)}
                                {item.expiryDate && <span>- {formatDate(item.expiryDate)}</span>}
                            </div>
                            {item.credentialId && <p className="text-xs text-soft-500 mb-2">ID: {item.credentialId}</p>}
                            {item.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.skills.map((skill, idx) => <span key={idx} className="badge badge-teal text-xs">{skill}</span>)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-navy-700 p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">{editingItem ? 'Edit Certificate' : 'Add Certificate'}</h2>
                            <button onClick={closeModal} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="label">Certificate Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required /></div>
                            <div><label className="label">Issuing Organization *</label><input type="text" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="input" placeholder="e.g., Google, AWS, Coursera" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Issue Date *</label><input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="input" required /></div>
                                <div><label className="label">Expiry Date</label><input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="input" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Credential ID</label><input type="text" value={formData.credentialId} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })} className="input" /></div>
                                <div><label className="label">Credential URL</label><input type="url" value={formData.credentialUrl} onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })} className="input" /></div>
                            </div>
                            <div><label className="label">Related Skills (comma-separated)</label><input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="input" placeholder="Python, Machine Learning, Data Analysis" /></div>
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

export default Certificates;
