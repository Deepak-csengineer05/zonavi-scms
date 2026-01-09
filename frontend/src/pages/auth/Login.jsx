import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-500 via-navy-600 to-teal-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/logo-primary.png" alt="ZONAVI" className="h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Welcome to ZONAVI</h1>
                    <p className="text-soft-300 mt-2">Find Your Zone. Navigate Your Success.</p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label !text-gray-200">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-500" />
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-11"
                                    placeholder="Enter your email or username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label !text-gray-200">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input !bg-white/5 !border-white/10 !text-white !placeholder-gray-400 focus:!ring-teal-500 pl-11 pr-11"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-500 hover:text-navy-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-300">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>

                {/* Demo credentials removed for production */}
            </div>
        </div>
    );
};

export default Login;
