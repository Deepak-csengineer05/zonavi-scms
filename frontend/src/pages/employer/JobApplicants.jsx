import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import { Mail, Phone, Award, Calendar, GripVertical, CheckCircle, XCircle, Clock, FileText, Linkedin, Github } from 'lucide-react';
import PageWrapper from '../../components/ui/PageWrapper';
import { toast } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const JobApplicants = () => {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    const fetchApplicants = async () => {
        try {
            const { data } = await employerAPI.getApplicants(id);
            setApplicants(data);
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;

        // Optimistic UI Update
        const updatedApplicants = applicants.map(app =>
            app._id === draggableId ? { ...app, status: newStatus } : app
        );
        setApplicants(updatedApplicants);

        try {
            await employerAPI.updateApplicationStatus(draggableId, newStatus);
            toast.success(`Moved to ${newStatus.replace('-', ' ')}`);
        } catch (error) {
            toast.error('Failed to update status');
            fetchApplicants(); // Revert on error
        }
    };

    const columns = {
        applied: { title: 'New Applications', color: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        'under-review': { title: 'Under Review', color: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
        shortlisted: { title: 'Interview / Shortlist', color: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
        accepted: { title: 'Offered / Accepted', color: 'border-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
        rejected: { title: 'Rejected', color: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/10' }
    };

    const getColumnApplicants = (status) => applicants.filter(app => app.status === status);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Applicant Tracking Board</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your candidates by dragging them across stages
                </p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-8 h-[calc(100vh-200px)] items-start">
                    {Object.entries(columns).map(([status, col]) => (
                        <div key={status} className={`flex-shrink-0 w-80 flex flex-col h-full rounded-xl bg-soft-100 dark:bg-navy-800 border-t-4 ${col.color}`}>
                            <div className={`p-4 font-semibold text-navy-800 dark:text-white flex justify-between items-center ${col.bg}`}>
                                {col.title}
                                <span className="bg-white dark:bg-navy-700 px-2 py-0.5 rounded text-sm shadow-sm">
                                    {getColumnApplicants(status).length}
                                </span>
                            </div>

                            <Droppable droppableId={status}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-3 flex-1 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-soft-200 dark:bg-navy-700/50' : ''}`}
                                    >
                                        {getColumnApplicants(status).map((app, index) => (
                                            <Draggable key={app._id} draggableId={app._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white dark:bg-navy-700 p-4 rounded-lg shadow-sm border border-soft-200 dark:border-navy-600 mb-3 group hover:shadow-md transition-shadow ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-teal-500' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-1 cursor-grab active:cursor-grabbing text-soft-400">
                                                                <GripVertical className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <img
                                                                        src={app.student.avatar || `https://ui-avatars.com/api/?name=${app.student.name}`}
                                                                        alt=""
                                                                        className="w-6 h-6 rounded-full"
                                                                    />
                                                                    <h4 className="font-medium text-navy-900 dark:text-soft-100 truncate">
                                                                        {app.student.name}
                                                                    </h4>
                                                                </div>

                                                                <div className="text-xs text-soft-500 dark:text-soft-400 mb-3 line-clamp-1">
                                                                    {app.student.branch} • {app.student.year} Year
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {app.student.cgpa && (
                                                                        <span className="text-xs bg-soft-100 dark:bg-navy-800 px-1.5 py-0.5 rounded text-soft-600 dark:text-soft-300">
                                                                            CGPA: {app.student.cgpa}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center justify-between border-t border-soft-100 dark:border-navy-600 pt-3 mt-3">
                                                                    <div className="flex gap-2">
                                                                        {app.student.linkedin && (
                                                                            <a href={app.student.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700">
                                                                                <Linkedin className="w-4 h-4" />
                                                                            </a>
                                                                        )}
                                                                        {app.student.github && (
                                                                            <a href={app.student.github} target="_blank" rel="noreferrer" className="text-gray-700 dark:text-white hover:text-gray-900">
                                                                                <Github className="w-4 h-4" />
                                                                            </a>
                                                                        )}
                                                                        <a href={`mailto:${app.student.email}`} className="text-teal-600 hover:text-teal-700">
                                                                            <Mail className="w-4 h-4" />
                                                                        </a>
                                                                    </div>
                                                                    <span className="text-[10px] text-soft-400">
                                                                        {new Date(app.appliedAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </PageWrapper>
    );
};

export default JobApplicants;
