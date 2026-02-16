import { Link } from 'react-router-dom';
import {
    ArrowRight, Play, TrendingUp, Award, FileText,
    Briefcase, Users, Bell, Target, Sparkles,
    CheckCircle, Star, BarChart3, Zap, Shield,
    Rocket, Brain, Globe, Trophy, ChevronRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const LandingPage = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [counters, setCounters] = useState({ students: 0, partners: 0, rate: 0, rating: 0 });
    const observerRef = useRef(null);

    const stats = [
        { value: 3, suffix: '', label: 'User Roles', key: 'students' },
        { value: 10, suffix: '+', label: 'Core Features', key: 'partners' },
        { value: 100, suffix: '%', label: 'Free for Students', key: 'rate' },
        { value: 100, suffix: '%', label: 'Responsive Design', key: 'rating' }
    ];

    const features = [
        {
            icon: BarChart3,
            title: 'Smart Career Analytics',
            description: 'Track your career score with AI-powered insights and improve strategically.',
            color: 'from-blue-500 to-blue-600',
            gradient: 'from-blue-500/20 to-transparent'
        },
        {
            icon: FileText,
            title: 'Professional Resume Builder',
            description: '4 stunning templates designed by experts with real-time preview.',
            color: 'from-purple-500 to-purple-600',
            gradient: 'from-purple-500/20 to-transparent'
        },
        {
            icon: Target,
            title: 'AI Job Matching',
            description: 'Get personalized job recommendations based on your profile.',
            color: 'from-teal-500 to-teal-600',
            gradient: 'from-teal-500/20 to-transparent'
        },
        {
            icon: TrendingUp,
            title: 'Skill Progress Tracking',
            description: 'Map your learning journey with visual progress indicators.',
            color: 'from-orange-500 to-orange-600',
            gradient: 'from-orange-500/20 to-transparent'
        },
        {
            icon: Bell,
            title: 'Real-Time Notifications',
            description: 'Never miss an opportunity with instant job alerts.',
            color: 'from-pink-500 to-pink-600',
            gradient: 'from-pink-500/20 to-transparent'
        },
        {
            icon: Award,
            title: 'Gamified Experience',
            description: 'Earn points, climb rankings, and compete with peers.',
            color: 'from-green-500 to-green-600',
            gradient: 'from-green-500/20 to-transparent'
        }
    ];

    const steps = [
        {
            step: '01',
            title: 'Create Your Profile',
            description: 'Sign up in 30 seconds and add your career details.',
            icon: Users,
            color: 'from-teal-400 to-teal-600'
        },
        {
            step: '02',
            title: 'Build Your Resume',
            description: 'Choose templates and craft compelling content.',
            icon: FileText,
            color: 'from-purple-400 to-purple-600'
        },
        {
            step: '03',
            title: 'Land Your Dream Job',
            description: 'Apply to companies and get hired faster.',
            icon: Briefcase,
            color: 'from-orange-400 to-orange-600'
        }
    ];

    const testimonials = [
        {
            quote: "Imagine: A student passionate about DSA finally connected with companies seeking problem solvers—not forced into unrelated training.",
            name: "Vision Scenario",
            role: "Student-Company Alignment",
            year: "What Success Looks Like",
            rating: 5,
            avatar: "💡"
        },
        {
            quote: "Picture: Building a professional resume in minutes with multiple templates—no more struggling with formatting or design.",
            name: "Vision Scenario",
            role: "Effortless Resume Creation",
            year: "What Success Looks Like",
            rating: 5,
            avatar: "📄"
        },
        {
            quote: "Envision: Tracking every opportunity in one dashboard—applications, skills, projects—all organized and accessible anytime.",
            name: "Vision Scenario",
            role: "Centralized Career Management",
            year: "What Success Looks Like",
            rating: 5,
            avatar: "📊"
        }
    ];

    const roleCards = [
        {
            icon: Users,
            title: 'For Students',
            price: 'FREE Forever',
            features: [
                'Unlimited Resume Builds',
                'Job Application Tracking',
                'Career Score Analytics',
                'Skill Progress Tracking',
                'Real-time Notifications',
                'Community Access'
            ],
            cta: 'Sign Up Free',
            link: '/register/student',
            popular: true
        },
        {
            icon: Shield,
            title: 'For Colleges',
            price: 'Custom Pricing',
            features: [
                'Bulk Student Import',
                'Placement Analytics',
                'Job Management',
                'Announcement System',
                'Rankings Dashboard',
                'Dedicated Support'
            ],
            cta: 'Contact Us',
            link: '/contact',
            popular: false
        },
        {
            icon: Briefcase,
            title: 'For Employers',
            price: 'Pay Per Hire',
            features: [
                'Post Unlimited Jobs',
                'Kanban Tracking',
                'AI Candidate Matching',
                'Company Branding',
                'Analytics Dashboard',
                'Priority Support'
            ],
            cta: 'Get Started',
            link: '/register/employer',
            popular: false
        }
    ];

    const trustBadges = [
        { icon: Rocket, label: 'Navigate Career Path' },
        { icon: Trophy, label: '3 User Roles' },
        { icon: Globe, label: 'Built for India' },
        { icon: Brain, label: 'Smart Features' }
    ];

    // Intersection Observer for scroll animations with smoother transitions
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

        observerRef.current = observer;

        document.querySelectorAll('[data-animate]').forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Counter animation for stats
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

    // Testimonial auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    >
                        <source src="/intro.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/70 to-navy-900"></div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-navy-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 text-center md:pt-8 md:pb-32">
                    {/* Logo */}
                    <div className="mb-8" data-animate>
                        <img
                            src="/logo-secondary.png"
                            alt="ZONAVI"
                            className="h-16 md:h-20 mx-auto mb-4 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 backdrop-blur-sm rounded-full border border-teal-400/30">
                            <Sparkles className="w-3 h-3 text-teal-400" />
                            <p className="text-teal-200 text-sm font-medium">Zone of Opportunities & Navigation of Vision</p>
                        </div>
                    </div>

                    {/* Main Hero Content */}
                    <div className="max-w-4xl mx-auto mb-10" data-animate>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="block">Your Career,</span>
                            <span className="block bg-gradient-to-r from-teal-400 via-teal-300 to-teal-200 bg-clip-text text-transparent">
                                Your Choice, Your Zone
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-soft-300 mb-8 max-w-2xl mx-auto">
                            Bridging the gap between what you dream and what you're trained for. A platform where students find opportunities aligned with their passion—not just placements.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Link
                                to="/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <span>Sign Up Free</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {trustBadges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm"
                                >
                                    <badge.icon className="w-4 h-4 text-teal-400" />
                                    <span className="text-soft-300">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement Section */}
            <section className="relative py-20 bg-gradient-to-b from-navy-900/50 to-transparent" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            The Placement Problem
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Nobody Talks About
                            </span>
                        </h2>
                        <p className="text-soft-300 max-w-2xl mx-auto mb-8">
                            Every year, thousands of students face the same disconnect
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-red-400/30 transition-all duration-500">
                            <div className="text-4xl mb-4">🏃</div>
                            <h3 className="text-xl font-bold mb-3">Trained for Service, Dreaming of Product</h3>
                            <p className="text-soft-300 text-sm leading-relaxed">
                                Students passionate about product companies get trained for service roles—and vice versa.
                            </p>
                        </div>

                        <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-red-400/30 transition-all duration-500">
                            <div className="text-4xl mb-4">💔</div>
                            <h3 className="text-xl font-bold mb-3">Skills Ignored, Interests Missed</h3>
                            <p className="text-soft-300 text-sm leading-relaxed">
                                Love DSA? Get full-stack training. Love web dev? Forced into algorithm bootcamps.
                            </p>
                        </div>

                        <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-red-400/30 transition-all duration-500">
                            <div className="text-4xl mb-4">🔇</div>
                            <h3 className="text-xl font-bold mb-3">Your Dreams, Never Asked</h3>
                            <p className="text-soft-300 text-sm leading-relaxed">
                                One-size-fits-all approach treats students like horses preparing for all races.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-teal-400/30 px-8 py-4">
                            <Sparkles className="w-6 h-6 text-teal-400" />
                            <p className="text-lg font-semibold">
                                <span className="text-white">Zonavi changes this.</span>
                                <span className="text-teal-400"> Your profile. Your skills. Your opportunities.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                className="relative py-12 border-y border-white/5 bg-gradient-to-b from-navy-900/50 to-transparent"
                data-section="stats"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-teal-400/30 hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-teal-400 to-white bg-clip-text text-transparent">
                                    {stat.decimal
                                        ? counters[stat.key].toFixed(1)
                                        : Math.floor(counters[stat.key]).toLocaleString()
                                    }
                                    {counters[stat.key] === stat.value && stat.suffix}
                                </div>
                                <div className="text-soft-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-16" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-400/20 mb-4">
                            <Sparkles className="w-4 h-4 text-teal-400" />
                            <span className="text-teal-300 text-sm font-semibold">Features</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Everything You Need to
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Succeed in Your Career
                            </span>
                        </h2>
                        <p className="text-soft-300 max-w-2xl mx-auto">
                            Powerful tools designed to accelerate your career journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                data-animate
                                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-teal-400/30 transition-all duration-500 hover:scale-105"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                                <div className="relative z-10">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-teal-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-soft-300 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative py-16 bg-gradient-to-b from-navy-900/30 to-transparent" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Get Started in
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                3 Simple Steps
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="relative group" data-animate>
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/10 hover:border-teal-400/30 transition-all duration-500 h-full">
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-xl font-bold shadow-xl group-hover:scale-110 transition-transform z-10`}>
                                        {step.step}
                                    </div>

                                    <div className="mt-6 mb-4 flex justify-center">
                                        <step.icon className="w-12 h-12 text-teal-400" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-center">
                                        {step.title}
                                    </h3>
                                    <p className="text-soft-300 text-sm text-center">
                                        {step.description}
                                    </p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-8 z-20">
                                        <ChevronRight className="w-8 h-8 text-teal-400/50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Scenarios */}
            <section className="relative py-16" data-animate>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            What Success
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Looks Like
                            </span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-10 md:p-12 shadow-2xl">
                            <div className="flex gap-1 mb-4 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            <blockquote className="text-xl md:text-2xl font-medium mb-8 text-center">
                                "{testimonials[activeTestimonial].quote}"
                            </blockquote>

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                    {testimonials[activeTestimonial].avatar}
                                </div>
                                <div className="text-center">
                                    <div className="font-bold">{testimonials[activeTestimonial].name}</div>
                                    <div className="text-teal-400 text-sm">{testimonials[activeTestimonial].role}</div>
                                    <div className="text-soft-400 text-xs">{testimonials[activeTestimonial].year}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-2 mt-6">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`transition-all duration-300 rounded-full ${index === activeTestimonial
                                            ? 'bg-teal-400 w-8 h-2'
                                            : 'bg-white/20 w-2 h-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="relative py-16 bg-gradient-to-b from-navy-900/30 to-transparent" data-animate>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Choose Your
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Perfect Plan
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {roleCards.map((card, index) => (
                            <div
                                key={index}
                                data-animate
                                className={`relative group ${card.popular ? 'md:-mt-2' : ''}`}
                            >
                                {card.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <div className="px-4 py-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full text-xs font-bold shadow-xl flex items-center gap-1">
                                            <Trophy className="w-3 h-3" />
                                            Popular
                                        </div>
                                    </div>
                                )}

                                <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border-2 p-6 transition-all duration-500 h-full flex flex-col ${card.popular
                                        ? 'border-teal-400 shadow-xl shadow-teal-500/20 scale-105'
                                        : 'border-white/10 hover:border-teal-400/30 hover:scale-105'
                                    }`}>
                                    <div className="text-center mb-6">
                                        <div className="inline-flex p-4 bg-teal-500/20 rounded-xl mb-4">
                                            <card.icon className="w-10 h-10 text-teal-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                            {card.price}
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-grow">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-soft-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={card.link}
                                        className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${card.popular
                                                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg'
                                                : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                            }`}
                                    >
                                        {card.cta}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-20" data-animate>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 md:p-16 shadow-2xl">
                        <div className="inline-flex p-5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-xl">
                            <Zap className="w-12 h-12 text-white" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Transform
                            <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Your Career?
                            </span>
                        </h2>

                        <p className="text-lg text-soft-300 mb-8">
                            Start your journey towards meaningful career opportunities
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="group px-10 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Sign Up Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/contact"
                                className="px-10 py-4 bg-white/10 text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
