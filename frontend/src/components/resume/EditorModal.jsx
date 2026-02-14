import React from 'react';
import {
    User, Briefcase, Code, GraduationCap,
    X, Plus, Trash2, Calendar,
    Github, Linkedin, Mail, Phone, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditorModal = ({ activeSection, onClose, data, onChange }) => {

    // Helper accessors
    const sections = [
        { id: 'personal', title: 'Personal Details', icon: User, color: 'bg-blue-50 text-blue-600' },
        { id: 'experience', title: 'Experience', icon: Briefcase, color: 'bg-purple-50 text-purple-600' },
        { id: 'projects', title: 'Projects', icon: Code, color: 'bg-teal-50 text-teal-600' },
        { id: 'skills', title: 'Skills', icon: GraduationCap, color: 'bg-orange-50 text-orange-600' },
    ];

    const currentSectionDef = sections.find(s => s.id === activeSection);

    const handleChange = (section, field, value, index = null) => {
        if (section === 'personalInfo') {
            onChange({
                ...data,
                personalInfo: {
                    ...data.personalInfo,
                    [field]: value
                }
            });
        } else {
            const newArray = [...data[section]];
            if (index !== null) {
                newArray[index] = { ...newArray[index], [field]: value };
            }
            onChange({
                ...data,
                [section]: newArray
            });
        }
    };

    const addItem = (section, initialItem) => {
        onChange({
            ...data,
            [section]: [...data[section], initialItem]
        });
    };

    const removeItem = (section, index) => {
        const newArray = data[section].filter((_, i) => i !== index);
        onChange({
            ...data,
            [section]: newArray
        });
    };

    if (!activeSection) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-navy-800 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-navy-700"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-navy-700 bg-soft-50 dark:bg-navy-900">
                        <div className="flex items-center gap-3">
                            {currentSectionDef && (
                                <>
                                    <div className={`p-2 rounded-lg ${currentSectionDef.color} bg-opacity-20`}>
                                        <currentSectionDef.icon size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-navy-900 dark:text-white">{currentSectionDef.title}</h2>
                                </>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-soft-200 dark:hover:bg-navy-800 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {activeSection === 'personal' && (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputGroup label="Full Name" value={data.personalInfo?.name} onChange={(v) => handleChange('personalInfo', 'name', v)} />
                                    <InputGroup label="Job Title / Branch" value={data.personalInfo?.branch} onChange={(v) => handleChange('personalInfo', 'branch', v)} />
                                    <InputGroup label="Email" value={data.personalInfo?.email} onChange={(v) => handleChange('personalInfo', 'email', v)} icon={Mail} />
                                    <InputGroup label="Phone" value={data.personalInfo?.phone} onChange={(v) => handleChange('personalInfo', 'phone', v)} icon={Phone} />
                                    <InputGroup label="Location" value={data.personalInfo?.location} onChange={(v) => handleChange('personalInfo', 'location', v)} icon={MapPin} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5 block tracking-wide">Professional Summary</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-soft-50 dark:bg-navy-900 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[100px] shadow-sm placeholder:text-gray-400"
                                        value={data.personalInfo?.bio || ''}
                                        onChange={(e) => handleChange('personalInfo', 'bio', e.target.value)}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputGroup label="LinkedIn" value={data.personalInfo?.linkedin} onChange={(v) => handleChange('personalInfo', 'linkedin', v)} icon={Linkedin} />
                                    <InputGroup label="GitHub" value={data.personalInfo?.github} onChange={(v) => handleChange('personalInfo', 'github', v)} icon={Github} />
                                </div>
                            </div>
                        )}

                        {activeSection === 'experience' && (
                            <div className="space-y-6">
                                {data.internships?.map((exp, index) => (
                                    <motion.div
                                        layout
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-soft-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 relative group"
                                    >
                                        <button
                                            onClick={() => removeItem('internships', index)}
                                            className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                                            <InputGroup label="Role" value={exp.role} onChange={(v) => handleChange('internships', 'role', v, index)} placeholder="e.g. Software Engineer Intern" />
                                            <InputGroup label="Company" value={exp.company} onChange={(v) => handleChange('internships', 'company', v, index)} placeholder="e.g. Google" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5 block tracking-wide">Start Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                                    value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => handleChange('internships', 'startDate', e.target.value, index)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5 block tracking-wide">End Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                                    value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => handleChange('internships', 'endDate', e.target.value, index)}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[80px] shadow-sm placeholder:text-gray-400"
                                            placeholder="Describe your responsibilities and achievements..."
                                            value={exp.description}
                                            onChange={(e) => handleChange('internships', 'description', e.target.value, index)}
                                        />
                                    </motion.div>
                                ))}
                                <button
                                    onClick={() => addItem('internships', { role: '', company: '', startDate: new Date(), endDate: new Date(), description: '' })}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl text-gray-500 dark:text-gray-400 hover:text-teal-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-navy-800 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus size={18} />
                                    Add Experience
                                </button>
                            </div>
                        )}

                        {activeSection === 'projects' && (
                            <div className="space-y-6">
                                {data.projects?.map((proj, index) => (
                                    <motion.div
                                        layout
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-soft-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 relative group"
                                    >
                                        <button
                                            onClick={() => removeItem('projects', index)}
                                            className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="mb-3">
                                            <InputGroup label="Project Title" value={proj.title} onChange={(v) => handleChange('projects', 'title', v, index)} placeholder="e.g. E-Commerce Platform" />
                                        </div>
                                        <div className="mb-3">
                                            <InputGroup
                                                label="Technologies"
                                                value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                                                onChange={(v) => handleChange('projects', 'technologies', v.split(',').map(t => t.trim()), index)}
                                                placeholder="React, Node.js, MongoDB (comma separated)"
                                            />
                                        </div>
                                        <textarea
                                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[80px] shadow-sm placeholder:text-gray-400"
                                            placeholder="Describe the project..."
                                            value={proj.description}
                                            onChange={(e) => handleChange('projects', 'description', e.target.value, index)}
                                        />
                                    </motion.div>
                                ))}
                                <button
                                    onClick={() => addItem('projects', { title: '', description: '', technologies: [] })}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl text-gray-500 dark:text-gray-400 hover:text-teal-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-navy-800 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus size={18} />
                                    Add Project
                                </button>
                            </div>
                        )}

                        {activeSection === 'skills' && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-3">
                                    {data.skills?.map((skill, index) => (
                                        <motion.div
                                            layout
                                            key={index}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex items-center gap-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 pl-3 pr-1 py-1.5 rounded-full shadow-sm"
                                        >
                                            <input
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => handleChange('skills', 'name', e.target.value, index)}
                                                className="bg-transparent border-none focus:ring-0 text-sm w-32 p-0 text-navy-800 dark:text-white font-medium"
                                                placeholder="Skill name"
                                            />
                                            <button
                                                onClick={() => removeItem('skills', index)}
                                                className="p-1 hover:bg-soft-100 dark:hover:bg-navy-700 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                    <button
                                        onClick={() => addItem('skills', { name: '' })}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-navy-800 transition-all text-sm font-medium"
                                    >
                                        <Plus size={16} />
                                        Add Skill
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-navy-700 bg-soft-50 dark:bg-navy-900 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-teal-500/30"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const InputGroup = ({ label, value, onChange, placeholder, icon: Icon }) => (
    <div className="relative">
        <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5 block tracking-wide">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon size={16} />
                </div>
            )}
            <input
                type="text"
                className={`w-full p-2.5 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm ${Icon ? 'pl-9' : ''}`}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    </div>
);

export default EditorModal;
