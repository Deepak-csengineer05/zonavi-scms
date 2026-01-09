import { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import AnnouncementCard from '../../components/ui/AnnouncementCard';
import { Plus, Trash2, Send, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'info', // info, warning, success, important
        targetAudience: 'all' // all, students, admins
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await announcementsAPI.getAll();
            setAnnouncements(res.data);
        } catch (error) {
            toast.error('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await announcementsAPI.create(formData);
            toast.success('Announcement posted successfully');
            setFormData({ title: '', content: '', type: 'info', targetAudience: 'all' });
            setIsCreating(false);
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post announcement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementsAPI.delete(id);
                toast.success('Announcement deleted');
                fetchAnnouncements();
            } catch (error) {
                toast.error('Failed to delete announcement');
            }
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'important': return <Bell className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <PageWrapper className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-title">Announcements</h1>
                    <p className="text-soft-600 dark:text-soft-400 mt-1">Manage system-wide notifications</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isCreating ? 'Cancel' : <><Plus className="w-4 h-4" /> New Announcement</>}
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="card animate-fade-in border-2 border-teal-500/20">
                    <h2 className="section-title mb-4">Post New Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Title</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g., Upcoming Maintenance"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['info', 'warning', 'success', 'important'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`
                                                p-2 rounded-lg border flex flex-col items-center justify-center gap-1 text-xs capitalize transition-all
                                                ${formData.type === type
                                                    ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                                                    : 'bg-white border-soft-200 text-soft-600 hover:bg-soft-50 dark:bg-navy-800 dark:border-navy-600 dark:text-soft-400'
                                                }
                                            `}
                                        >
                                            {getTypeIcon(type)}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">Target Audience</label>
                                <select
                                    className="input"
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                >
                                    <option value="all">All Users</option>
                                    <option value="students">Students Only</option>
                                    <option value="admins">Admins Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Content</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                placeholder="Enter announcement details..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary flex items-center gap-2">
                                <Send className="w-4 h-4" /> Post Announcement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    </div>
                ) : announcements.length > 0 ? (
                    announcements.map(announcement => (
                        <div key={announcement._id} className="relative group">
                            <AnnouncementCard announcement={announcement} />
                            <button
                                onClick={() => handleDelete(announcement._id)}
                                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Announcement"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-soft-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No announcements posted yet</p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default AdminAnnouncements;
