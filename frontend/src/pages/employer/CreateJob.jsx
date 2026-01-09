import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import { toast } from 'react-hot-toast';

const CreateJob = () => {
    const navigate = useNavigate();
    // const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        description: '',
        skillsRef: '',
        location: '',
        type: 'Full-time',
        salary: '',
        applyLink: '',
        deadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const jobData = {
                ...formData,
                skillsRequired: formData.skillsRef.split(',').map(s => s.trim()).filter(Boolean)
            };
            delete jobData.skillsRef;

            await employerAPI.createJob(jobData);
            toast.success('Job posted successfully');
            navigate('/employer/jobs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <PageWrapper>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Post a New Job</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Create a job posting to attract talented candidates</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-6">
                    {/* Job Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Position *
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="input"
                            placeholder="e.g., Software Engineer, Data Analyst"
                        />
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="input resize-none"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        />
                    </div>

                    {/* Skills Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Skills Required (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="skillsRef"
                            value={formData.skillsRef}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., JavaScript, React, Node.js"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="e.g., Bangalore, Remote"
                            />
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Job Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Salary Range
                            </label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="input"
                                placeholder="e.g., ₹ 5-8 LPA"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Application Deadline *
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                                min={minDate}
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Apply Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Application Link/Email *
                        </label>
                        <input
                            type="text"
                            name="applyLink"
                            value={formData.applyLink}
                            onChange={handleChange}
                            required
                            className="input"
                            placeholder="e.g., careers@company.com or https://company.com/apply"
                        />
                        <p className="text-xs text-gray-500 mt-1">Students will use this to apply</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-navy-700">
                        <button
                            type="button"
                            onClick={() => navigate('/employer/jobs')}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default CreateJob;
