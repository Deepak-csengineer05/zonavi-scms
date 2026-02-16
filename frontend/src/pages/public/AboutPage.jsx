import {
    Target, Eye, Heart, Users, TrendingUp, Award, Sparkles,
    CheckCircle, Rocket, Building2, Shield, Lightbulb,
    ChevronRight, Quote, FileText, Bell, Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState({});
    const [counters, setCounters] = useState({ satisfaction: 0, placements: 0, companies: 0, colleges: 0 });

    const values = [
        {
            icon: Target,
            title: 'Student-First',
            description: 'Every feature designed with students at the center to empower professionals.',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Sparkles,
            title: 'Innovation',
            description: 'Leverage cutting-edge technology for the best career experience.',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Heart,
            title: 'Inclusive',
            description: 'Making opportunities accessible to every student, regardless of background.',
            color: 'from-pink-500 to-pink-600'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Building a supportive ecosystem for mutual success.',
            color: 'from-teal-500 to-teal-600'
        }
    ];

    const milestones = [
        {
            year: 'Oct 2025',
            event: 'Zonavi Conceived',
            description: 'Identified the disconnect in campus placements',
            icon: Rocket,
            color: 'from-teal-500 to-teal-600'
        },
        {
            year: 'Nov 2025',
            event: 'First Build',
            description: 'Core architecture and database design',
            icon: Users,
            color: 'from-blue-500 to-blue-600'
        },
        {
            year: 'Dec 2025',
            event: 'Features Live',
            description: 'Resume builder, job tracking, skills',
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600'
        },
        {
            year: 'Jan 2026',
            event: 'Employer Portal',
            description: 'Kanban tracking and company profiles',
            icon: Building2,
            color: 'from-orange-500 to-orange-600'
        },
        {
            year: 'Feb 2026',
            event: 'Ongoing Development',
            description: 'Continuous improvements & new features',
            icon: Award,
            color: 'from-green-500 to-green-600'
        }
    ];

    const stats = [
        { value: 3, suffix: '', label: 'User Roles', key: 'satisfaction' },
        { value: 10, suffix: '+', label: 'Core Features', key: 'placements', format: '' },
        { value: 100, suffix: '%', label: 'Free for Students', key: 'companies' },
        { value: 4, suffix: '', label: 'Resume Templates', key: 'colleges' }
    ];

    const differentiators = [
        {
            icon: Target,
            title: 'Student Agency',
            description: 'You choose your path, we track your progress and match opportunities.'
        },
        {
            icon: TrendingUp,
            title: 'Career Score System',
            description: 'Gamified profile building with real-time scoring algorithm.'
        },
        {
            icon: FileText,
            title: 'Pro Resume Builder',
            description: '4 professional templates with instant PDF generation.'
        },
        {
            icon: Lightbulb,
            title: 'Kanban for Employers',
            description: 'Visual drag-and-drop applicant tracking board.'
        },
        {
            icon: Bell,
            title: 'Real-Time Updates',
            description: 'Instant notifications for application status changes.'
        },
        {
            icon: Shield,
            title: 'Free Forever',
            description: 'No hidden costs for students. Built with a mission.'
        }
    ];

    // Scroll animations with smoother transitions
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        setIsVisible(prev => ({ ...prev, [entry.target.dataset.section]: true }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Counter animation
    useEffect(() => {
        if (isVisible.stats) {
            stats.forEach(stat => {
                let start = 0;
                const end = stat.value;
                const duration = 2000;
                const increment = end / (duration / 16);

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= end) {
                        setCounters(prev => ({ ...prev, [stat.key]: end }));
                        clearInterval(timer);
                    } else {
                        setCounters(prev => ({ ...prev, [stat.key]: start }));
                    }
                }, 16);
            });
        }
    }, [isVisible.stats]);

    const formatNumber = (num, format) => {
        if (format === 'K') {
            return (num / 1000).toFixed(0) + 'K';
        }
        return Math.floor(num).toLocaleString();
    };

    return (
        <div className="text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-15"
                    >
                        <source src="/intro.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 to-navy-900"></div>
                    <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-teal-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-400/30 mb-6" data-animate>
                            <Sparkles className="w-4 h-4 text-teal-400" />
                            <span className="text-teal-300 text-sm font-semibold">Our Story</span>
                        </div>
                        <h1
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent"
                            data-animate
                        >
                            About Zonavi
                        </h1>
                        <p className="text-xl md:text-2xl text-soft-200 max-w-3xl mx-auto leading-relaxed" data-animate>
                            Bridging the Gap Between Student Aspirations and Career Opportunities
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl" data-animate>
                        <Quote className="absolute top-4 right-4 w-12 h-12 text-teal-400/10" />

                        <div className="relative z-10">
                            <p className="text-lg md:text-xl text-soft-200 leading-relaxed mb-6">
                                <strong className="text-white">Zonavi</strong> stands for{' '}
                                <strong className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                    "Zone of Opportunities & Navigation of Vision"
                                </strong>
                                {' '}— a comprehensive career ecosystem bridging students, institutions, and employers.
                            </p>
                            <p className="text-base md:text-lg text-soft-300 leading-relaxed">
                                Born from witnessing firsthand the disconnect between student aspirations and placement training, Zonavi provides a platform where students can showcase their actual skills, track their progress, and find opportunities that align with their career goals—not just any opportunity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="relative py-12 bg-gradient-to-b from-navy-900/30 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-teal-400/30 transition-all duration-500" data-animate>
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10">
                                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mb-5 shadow-xl">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-soft-300 leading-relaxed">
                                    To bridge the gap between students, colleges, and employers by providing an intelligent platform that listens to student aspirations, showcases their skills, and matches them with opportunities that align with their dreams—not just any placement.
                                </p>
                            </div>
                        </div>

                        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-purple-400/30 transition-all duration-500" data-animate>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10">
                                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-5 shadow-xl">
                                    <Eye className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                <p className="text-soft-300 leading-relaxed">
                                    A world where every student has access to tools and opportunities to navigate their career path with confidence—where training aligns with dreams, and placements match passions. Becoming India's leading platform for meaningful career connections.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Founder */}
            <section className="relative py-16 bg-gradient-to-b from-navy-900/30 to-transparent" data-animate>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Meet the
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Founder
                            </span>
                        </h2>
                    </div>

                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                                    DS
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-3xl font-bold mb-2">Deepak Saravanakumar</h3>
                                <p className="text-teal-400 font-semibold mb-1">Founder & Developer</p>
                                <p className="text-soft-300 mb-4">Third Year, Computer Science Engineering</p>
                                <p className="text-soft-400 text-sm mb-6">Karpagam College of Engineering, Coimbatore</p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                    <p className="text-soft-200 leading-relaxed italic">
                                        "I've seen my classmates struggle—talented developers forced into roles they didn't want, dreamers trained for the wrong race. I built Zonavi because students deserve a system that listens to their goals, showcases their skills, and matches them with the right opportunities—not just any opportunity."
                                    </p>
                                </div>

                                {/* Links */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <a
                                        href="https://deepak-csengineer05.vercel.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        <Globe className="w-4 h-4" />
                                        View Portfolio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="relative py-12" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Our Core
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Values
                            </span>
                        </h2>
                        <p className="text-soft-300 max-w-2xl mx-auto">
                            Principles guiding everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                data-animate
                                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-teal-400/30 transition-all duration-500"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.color} mb-4 shadow-lg`}>
                                    <value.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-lg font-bold mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-soft-300 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Timeline */}
            <section className="relative py-12 bg-gradient-to-b from-navy-900/30 to-transparent" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Our
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Journey
                            </span>
                        </h2>
                    </div>

                    <div className="relative">

                        <div className="grid md:grid-cols-5 gap-4">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="relative" data-animate>

                                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-5 hover:border-teal-400/30 transition-all duration-500 mt-20 md:mt-0">
                                        <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${milestone.color} mb-3 shadow-lg`}>
                                            <milestone.icon className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                            {milestone.year}
                                        </div>
                                        <h3 className="text-base font-bold mb-1.5">{milestone.event}</h3>
                                        <p className="text-soft-400 text-xs leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative py-12" data-section="stats" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Impact by
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Numbers
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/15 hover:border-teal-400/30 transition-all duration-500"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-1 bg-gradient-to-r from-teal-400 to-white bg-clip-text text-transparent">
                                    {stat.format
                                        ? formatNumber(counters[stat.key], stat.format)
                                        : Math.floor(counters[stat.key])
                                    }
                                    {counters[stat.key] === stat.value && stat.suffix}
                                </div>
                                <div className="text-soft-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Differentiators */}
            <section className="relative py-12 bg-gradient-to-b from-navy-900/30 to-transparent" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            What Makes Us
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Different
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {differentiators.map((item, index) => (
                            <div
                                key={index}
                                data-animate
                                className="group flex items-start gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-5 hover:border-teal-400/30 transition-all duration-500"
                            >
                                <div className="p-2.5 bg-teal-500/20 rounded-lg flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold mb-1.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-soft-300 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-16" data-animate>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 md:p-14 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="inline-flex p-5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-xl">
                                <Award className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Join Our
                                <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                    Mission
                                </span>
                            </h2>
                            <p className="text-lg text-soft-300 mb-8 max-w-2xl mx-auto">
                                Be part of the career revolution
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/register"
                                    className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Get Started Free
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="/contact"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 hover:border-teal-400/50 transition-all duration-300"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
