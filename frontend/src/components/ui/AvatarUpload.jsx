import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AvatarUpload = ({ currentAvatar, onUploadSuccess }) => {
    const [preview, setPreview] = useState(currentAvatar);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        // Evaluate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, JPG, PNG)');
            return;
        }

        // Evaluate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        // Show preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload
        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        const loadingToast = toast.loading('Uploading avatar...');

        try {
            const { data } = await api.post('/upload/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Assuming backend returns full URL or relative path
            const avatarUrl = import.meta.env.VITE_API_URL
                ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${data.avatarUrl}`
                : `${window.location.protocol}//${window.location.hostname}:5000${data.avatarUrl}`;

            setPreview(avatarUrl);
            onUploadSuccess(avatarUrl);
            toast.success('Avatar uploaded successfully!', { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload avatar', { id: loadingToast });
            // Revert preview on error if needed, or keep it to let user retry
        } finally {
            setUploading(false);
        }
    };

    const triggerInput = () => {
        inputRef.current.click();
    };

    return (
        <div className="w-full">
            <label className="label">Profile Picture</label>
            <div
                className={`
                    relative w-full h-32 rounded-xl border-2 border-dashed transition-all duration-200
                    flex items-center justify-center cursor-pointer overflow-hidden group
                    ${dragActive
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-soft-400 dark:border-navy-500 hover:border-teal-400 dark:hover:border-teal-400 bg-soft-200 dark:bg-navy-800'
                    }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerInput}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png"
                />

                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Avatar Preview"
                            className="h-full w-full object-contain opacity-50 group-hover:opacity-30 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-navy-700 shadow-lg relative z-10">
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <Upload className="w-8 h-8 text-navy-800 dark:text-soft-100 mb-1" />
                            <p className="text-sm font-medium text-navy-800 dark:text-soft-100">Change Photo</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-soft-500 dark:text-soft-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <p className="text-sm font-medium">Click or drag image to upload</p>
                        <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-navy-900/80 flex items-center justify-center z-30">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarUpload;
