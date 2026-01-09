import { Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
    const getIcon = () => {
        switch (announcement.type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'important': return <Bell className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (announcement.type) {
            case 'warning': return 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30';
            case 'success': return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30';
            case 'important': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
            default: return 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30';
        }
    };

    return (
        <div className={`p-4 rounded-lg border mb-3 flex gap-3 ${getBgColor()}`}>
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div>
                <h4 className="font-semibold text-navy-800 dark:text-soft-100 mb-1">
                    {announcement.title}
                </h4>
                <p className="text-sm text-soft-600 dark:text-soft-400">
                    {announcement.content}
                </p>
                <div className="mt-2 text-xs text-soft-500 flex items-center gap-2">
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Posted by {announcement.createdBy?.name || 'Admin'}</span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
