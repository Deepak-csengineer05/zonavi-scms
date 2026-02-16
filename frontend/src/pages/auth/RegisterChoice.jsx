import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

const RegisterChoice = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-500 via-navy-600 to-teal-600 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <img src="/logo-secondary.png" alt="ZONAVI" className="h-20 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-white mb-3">Join ZONAVI</h1>
                    <p className="text-soft-200 text-lg">Find Your Zone. Navigate Your Success.</p>
                    <p className="text-soft-300 mt-2">Choose your account type to get started</p>
                </div>

                {/* Registration Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Registration */}
                    <Link
                        to="/register/student"
                        className="group bg-white/4 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 hover:bg-white/0 transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                I'm a Student
                            </h2>
                            <p className="text-gray-200 mb-6">
                                Track your career journey, apply to jobs, build your profile, and connect with opportunities
                            </p>
                            <ul className="text-left space-y-2 mb-6 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span>Access to exclusive job opportunities</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span>Build and showcase your resume</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span>Track your skills and achievements</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span>Connect with alumni and peers</span>
                                </li>
                            </ul>
                            <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-4 transition-all">
                                Register as Student
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Employer Registration */}
                    <Link
                        to="/register/employer"
                        className="group bg-white/4 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 hover:bg-white/0 transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                I'm an Employer
                            </h2>
                            <p className="text-gray-200 mb-6">
                                Find talented students, post job openings, manage applications, and build your team
                            </p>
                            <ul className="text-left space-y-2 mb-6 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">✓</span>
                                    <span>Post unlimited job opportunities</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">✓</span>
                                    <span>Access to verified student profiles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">✓</span>
                                    <span>Manage applications efficiently</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">✓</span>
                                    <span>Analytics and hiring insights</span>
                                </li>
                            </ul>
                            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                                Register as Employer
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Login Link */}
                <div className="text-center mt-8 pb-8">
                    <p className="text-soft-200">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterChoice;
