import { Toaster, toast, resolveValue } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                className: '!bg-white dark:!bg-navy-700 !text-navy-800 dark:!text-soft-100 !shadow-elevated !rounded-lg border border-soft-200 dark:border-navy-600',
                style: {
                    padding: '16px',
                    maxWidth: '400px',
                },
                success: {
                    icon: <CheckCircle className="w-5 h-5 text-teal-500" />,
                    className: '!border-teal-100 dark:!border-teal-900/30 !bg-teal-50/50 dark:!bg-teal-900/10',
                },
                error: {
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
                    className: '!border-red-100 dark:!border-red-900/30 !bg-red-50/50 dark:!bg-red-900/10',
                },
            }}
        >
            {(t) => (
                <div
                    className={`
                        ${t.visible ? 'animate-enter' : 'animate-leave'}
                        flex items-start gap-3 p-4 rounded-lg shadow-elevated
                        bg-white dark:bg-navy-700 border border-soft-200 dark:border-navy-600
                        ${t.type === 'success' ? '!border-teal-100 dark:!border-teal-900/30 !bg-teal-50/50 dark:!bg-teal-900/10' : ''}
                        ${t.type === 'error' ? '!border-red-100 dark:!border-red-900/30 !bg-red-50/50 dark:!bg-red-900/10' : ''}
                    `}
                >
                    <div className="flex-shrink-0 pt-0.5">
                        {t.type === 'success' && <CheckCircle className="w-5 h-5 text-teal-500" />}
                        {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {t.type === 'loading' && <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />}
                        {t.type === 'blank' && <Info className="w-5 h-5 text-navy-500 dark:text-soft-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-800 dark:text-soft-100">
                            {resolveValue(t.message, t)}
                        </p>
                    </div>

                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-shrink-0 p-1 rounded-md text-soft-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </Toaster>
    );
};

export default Toast;
