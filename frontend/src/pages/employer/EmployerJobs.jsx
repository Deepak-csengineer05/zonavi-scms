import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import { Plus, Edit, Trash2, Users, Eye, IndianRupee } from 'lucide-react';
import PageWrapper from '../../components/ui/PageWrapper';
import { toast } from 'react-hot-toast';

const EmployerJobs = () => {
    // const { showToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await employerAPI.getJobs();
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await employerAPI.deleteJob(id);
            toast.success('Job deleted successfully');
            fetchJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete job');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white">My Job Postings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{jobs.length} active job(s)</p>
                </div>
                <Link to="/employer/jobs/create" className="btn btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500 mb-4">No job postings yet</p>
                    <Link to="/employer/jobs/create" className="btn btn-primary">
                        Post Your First Job
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        {job.company?.logo && (
                                            <img
                                                src={job.company.logo}
                                                alt={job.company.companyName}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
                                                {job.position}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {job.company?.companyName || 'Your Company'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span>📍 {job.location}</span>
                                        <span>💼 {job.type}</span>
                                        <span className="flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4" />
                                            {job.salary}
                                        </span>
                                        <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>

                                    <div className="mt-4 flex gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {job.views || 0} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {job.applicationCount || 0} applications
                                        </span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2">
                                    <Link
                                        to={`/employer/jobs/${job._id}/applicants`}
                                        className="btn btn-secondary text-sm flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        View Applicants
                                    </Link>
                                    <Link
                                        to={`/employer/jobs/${job._id}/edit`}
                                        className="btn bg-blue-500 hover:bg-blue-600 text-white text-sm flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="btn bg-red-500 hover:bg-red-600 text-white text-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

export default EmployerJobs;
