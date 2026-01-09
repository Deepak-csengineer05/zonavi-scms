import { useState, useEffect } from 'react';
import { projectsAPI } from '../../services/api';
import { FolderKanban, Plus, Edit2, Trash2, ExternalLink, Github, X, Calendar } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', technologies: '', githubUrl: '', liveUrl: '',
        startDate: '', endDate: '', status: 'ongoing'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await projectsAPI.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (editingProject) {
                await projectsAPI.update(editingProject._id, projectData);
            } else {
                await projectsAPI.create(projectData);
            }
            fetchProjects();
            closeModal();
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id);
                fetchProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies?.join(', ') || '',
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            startDate: project.startDate?.split('T')[0] || '',
            endDate: project.endDate?.split('T')[0] || '',
            status: project.status || 'ongoing'
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', startDate: '', endDate: '', status: 'ongoing' });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">My Projects</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="card text-center py-12">
                    <FolderKanban className="w-16 h-16 mx-auto text-soft-400 mb-4" />
                    <h2 className="text-xl font-semibold text-navy-700 dark:text-soft-200 mb-2">No projects yet</h2>
                    <p className="text-soft-600 dark:text-soft-400 mb-4">Start building your portfolio by adding your first project</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> Add Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project._id} className="card card-hover">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-navy-800 dark:text-soft-100 line-clamp-1">{project.title}</h3>
                                <span className={`badge ${project.status === 'completed' ? 'badge-success' : project.status === 'on-hold' ? 'badge-warning' : 'badge-teal'}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-soft-600 dark:text-soft-400 line-clamp-3 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.technologies?.slice(0, 4).map((tech, idx) => (
                                    <span key={idx} className="badge badge-primary text-xs">{tech}</span>
                                ))}
                                {project.technologies?.length > 4 && <span className="badge badge-primary text-xs">+{project.technologies.length - 4}</span>}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-soft-300 dark:border-navy-600">
                                <div className="flex gap-2">
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600">
                                            <Github className="w-4 h-4 text-soft-600 dark:text-soft-400" />
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600">
                                            <ExternalLink className="w-4 h-4 text-soft-600 dark:text-soft-400" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEditModal(project)} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600">
                                        <Edit2 className="w-4 h-4 text-soft-600 dark:text-soft-400" />
                                    </button>
                                    <button onClick={() => handleDelete(project._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-navy-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-navy-700 p-4 border-b border-soft-300 dark:border-navy-600 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-navy-800 dark:text-soft-100">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button onClick={closeModal} className="p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="label">Project Title *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" placeholder="My Awesome Project" required />
                            </div>
                            <div>
                                <label className="label">Description *</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[100px]" placeholder="Describe your project..." required />
                            </div>
                            <div>
                                <label className="label">Technologies (comma-separated)</label>
                                <input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="input" placeholder="React, Node.js, MongoDB" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">GitHub URL</label>
                                    <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="input" placeholder="https://github.com/..." />
                                </div>
                                <div>
                                    <label className="label">Live URL</label>
                                    <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="input" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="label">Start Date</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input" />
                                </div>
                                <div>
                                    <label className="label">End Date</label>
                                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input" />
                                </div>
                                <div>
                                    <label className="label">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input">
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="on-hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingProject ? 'Save Changes' : 'Add Project'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
