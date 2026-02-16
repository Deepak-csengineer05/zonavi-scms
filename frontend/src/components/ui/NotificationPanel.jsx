import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every minute for new notifications
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success('All marked as read');
        } catch (error) {
            console.error('Failed to mark all read');
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await handleMarkAsRead(notification._id);
        }
        if (notification.link) {
            setIsOpen(false);
            navigate(notification.link);
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-soft-200 dark:hover:bg-navy-600 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-navy-600 dark:text-soft-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-navy-800"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-full ml-2 mt-2 w-80 md:w-96 bg-white dark:bg-navy-800 rounded-lg shadow-xl border border-soft-200 dark:border-navy-600 z-50 overflow-hidden animate-fade-in-down">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-soft-200 dark:border-navy-600 flex justify-between items-center bg-soft-50 dark:bg-navy-900/50">
                        <h3 className="font-semibold text-navy-800 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-soft-100 dark:divide-navy-700">
                                {notifications.map(notification => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={clsx(
                                            "p-4 cursor-pointer hover:bg-soft-50 dark:hover:bg-navy-700/50 transition-colors flex gap-3",
                                            !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                            notification.type === 'success' ? 'bg-green-500' :
                                                notification.type === 'error' ? 'bg-red-500' :
                                                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500',
                                            notification.read && "opacity-50"
                                        )} />
                                        <div className="flex-1">
                                            <p className={clsx(
                                                "text-sm font-medium text-navy-800 dark:text-soft-100",
                                                notification.read && "opacity-80"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-soft-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-soft-400 mt-2">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-soft-400">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
