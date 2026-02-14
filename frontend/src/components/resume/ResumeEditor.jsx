import React, { useState } from 'react';
import {
    User, Briefcase, Code, GraduationCap,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeEditor = ({ data, onSectionSelect }) => {

    const sections = [
        { id: 'personal', title: 'Personal Details', icon: User, color: 'bg-blue-50 text-blue-600' },
        { id: 'experience', title: 'Experience', icon: Briefcase, count: data.internships?.length, color: 'bg-purple-50 text-purple-600' },
        { id: 'projects', title: 'Projects', icon: Code, count: data.projects?.length, color: 'bg-teal-50 text-teal-600' },
        { id: 'skills', title: 'Skills', icon: GraduationCap, count: data.skills?.length, color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-4 px-1">Editor Sections</h3>
            <div className="grid gap-3 overflow-y-auto pr-1 pb-4">
                {sections.map((section) => (
                    <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSectionSelect(section.id)}
                        className="flex items-center p-4 bg-white dark:bg-navy-800 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 text-left group transition-all hover:shadow-md"
                    >
                        <div className={`p-3 rounded-lg ${section.color} mr-4`}>
                            <section.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-navy-900 dark:text-white">{section.title}</h4>
                            {section.count !== undefined && (
                                <p className="text-xs text-soft-500">{section.count} items</p>
                            )}
                        </div>
                        <ChevronRight className="text-soft-400 group-hover:text-navy-600 dark:group-hover:text-white transition-colors" size={18} />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ResumeEditor;
