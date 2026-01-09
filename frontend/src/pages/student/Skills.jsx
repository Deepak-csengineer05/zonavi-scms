import { useState, useEffect } from 'react';
import { skillsAPI } from '../../services/api';
import { Code2, Plus, Trash2, X } from 'lucide-react';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: 'other', level: 'beginner' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await skillsAPI.getAll();
            setSkills(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await skillsAPI.create(formData);
            fetchData();
            setShowModal(false);
            setFormData({ name: '', category: 'other', level: 'beginner' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add skill');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this skill?')) {
            try { await skillsAPI.delete(id); fetchData(); } catch (e) { console.error(e); }
        }
    };

    const categories = [
        { value: 'frontend', label: 'Frontend', color: 'from-blue-500 to-blue-600' },
        { value: 'backend', label: 'Backend', color: 'from-green-500 to-green-600' },
        { value: 'database', label: 'Database', color: 'from-yellow-500 to-yellow-600' },
        { value: 'devops', label: 'DevOps', color: 'from-purple-500 to-purple-600' },
        { value: 'mobile', label: 'Mobile', color: 'from-pink-500 to-pink-600' },
        { value: 'tools', label: 'Tools', color: 'from-orange-500 to-orange-600' },
        { value: 'languages', label: 'Languages', color: 'from-cyan-500 to-cyan-600' },
        { value: 'soft-skills', label: 'Soft Skills', color: 'from-teal-500 to-teal-600' },
        { value: 'other', label: 'Other', color: 'from-gray-500 to-gray-600' }
    ];

    const levels = [
        { value: 'beginner', label: 'Beginner', width: 'w-1/4' },
        { value: 'intermediate', label: 'Intermediate', width: 'w-2/4' },
        { value: 'advanced', label: 'Advanced', width: 'w-3/4' },
        { value: 'expert', label: 'Expert', width: 'w-full' }
    ];

    const groupedSkills = categories.map(cat => ({
        ...cat,
        skills: skills.filter(s => s.category === cat.value)
    })).filter(cat => cat.skills.length > 0);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">My Skills</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Skill</button>
            </div>

            {skills.length === 0 ? (
                <div className="card text-center py-12">
                    <Code2 className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                    <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">No skills added yet</h2>
                    <p className="text-soft-600 dark:text-soft-400 mb-4">Showcase your technical expertise</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Skill</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedSkills.map((cat) => (
                        <div key={cat.value} className="card">
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color}`}></div>
                                <h2 className="section-title">{cat.label}</h2>
                                <span className="badge badge-primary ml-auto">{cat.skills.length}</span>
                            </div>
                            <div className="space-y-3">
                                {cat.skills.map((skill) => {
                                    const levelInfo = levels.find(l => l.value === skill.level) || levels[0];
                                    return (
                                        <div key={skill._id} className="flex items-center gap-4 group">
                                            <span className="w-32 font-medium text-navy-700 dark:text-soft-200 capitalize">{skill.name}</span>
                                            <div className="flex-1 h-2 bg-soft-300 dark:bg-navy-600 rounded-full overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${cat.color} ${levelInfo.width} transition-all duration-500`}></div>
                                            </div>
                                            <span className="text-xs text-soft-500 w-20">{levelInfo.label}</span>
                                            <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-opacity">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-md">
                        <div className="p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">Add Skill</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div><label className="label">Skill Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="e.g., React, Python, AWS" required /></div>
                            <div><label className="label">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input">
                                {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                            </select></div>
                            <div><label className="label">Proficiency Level</label><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="input">
                                {levels.map(lvl => <option key={lvl.value} value={lvl.value}>{lvl.label}</option>)}
                            </select></div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Skill</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
