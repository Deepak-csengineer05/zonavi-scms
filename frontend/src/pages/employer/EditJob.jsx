import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';
import { toast } from 'react-hot-toast';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            // Ideally backend should have getJob(id), but getting all and filtering is safe for now
            const { data } = await employerAPI.getJobs();
            const job = data.find(j => j._id === id);

            if (!job) {
                toast.error('Job not found');
                navigate('/employer/jobs');
                return;
            }

            setFormData({
                position: job.position,
                description: job.description,
                skillsRef: job.skillsRequired?.join(', '),
                location: job.location,
                type: job.type,
                salary: job.salary,
                applyLink: job.applyLink,
                deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
            navigate('/employer/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const jobData = {
                ...formData,
                skillsRequired: formData.skillsRef.split(',').map(s => s.trim()).filter(Boolean)
            };
            delete jobData.skillsRef;

            await employerAPI.updateJob(id, jobData);
            toast.success('Job updated successfully');
            navigate('/employer/jobs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const minDate = new Date().toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Edit Job Posting</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Update your job details</p>
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
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-navy-700">
                        <button
                            type="button"
                            onClick={() => navigate('/employer/jobs')}
                            className="btn btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default EditJob;
