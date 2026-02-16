import { useState, useEffect, useRef } from 'react';
import {
    Mail, Phone, MapPin, Send, Linkedin, Twitter, Instagram,
    Facebook, CheckCircle, Sparkles, Clock, MessageCircle,
    Copy, Check, Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [copiedInfo, setCopiedInfo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#0f2744',
                    color: '#fff',
                    border: '1px solid rgba(61, 139, 139, 0.3)'
                }
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedInfo(type);
        toast.success('Copied to clipboard!', {
            duration: 2000,
            style: {
                background: '#0f2744',
                color: '#fff',
                border: '1px solid rgba(61, 139, 139, 0.3)'
            }
        });
        setTimeout(() => setCopiedInfo(null), 2000);
    };

    // Enhanced scroll animations with opacity control
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
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

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            content: 'deepakcsengineer05@gmail.com',
            link: 'mailto:deepakcsengineer05@gmail.com',
            copyText: 'deepakcsengineer05@gmail.com',
            type: 'email',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: '+91 93455 61452',
            link: 'tel:+919345561452',
            copyText: '+919345561452',
            type: 'phone',
            color: 'from-teal-500 to-teal-600'
        },
        {
            icon: MapPin,
            title: 'Location',
            content: 'Coimbatore, Tamil Nadu, India',
            link: '#',
            copyText: 'Coimbatore, Tamil Nadu, India',
            type: 'location',
            color: 'from-purple-500 to-purple-600'
        }
    ];

    const socialLinks = [
        {
            icon: Linkedin,
            label: 'LinkedIn',
            link: 'https://www.linkedin.com',
            color: 'hover:text-blue-400',
            bgColor: 'hover:bg-blue-500/20',
            followers: 'Connect'
        },
        {
            icon: Twitter,
            label: 'Twitter',
            link: 'https://twitter.com',
            color: 'hover:text-sky-400',
            bgColor: 'hover:bg-sky-500/20',
            followers: 'Follow'
        },
        {
            icon: Instagram,
            label: 'Instagram',
            link: 'https://www.instagram.com',
            color: 'hover:text-pink-400',
            bgColor: 'hover:bg-pink-500/20',
            followers: 'Follow'
        },
        {
            icon: Facebook,
            label: 'Facebook',
            link: 'https://www.facebook.com',
            color: 'hover:text-blue-500',
            bgColor: 'hover:bg-blue-600/20',
            followers: 'Like'
        }
    ];

    const reasons = [
        'Feedback & Suggestions',
        'Collaboration inquiries',
        'Technical support',
        'Feature requests',
        'Investment opportunities',
        'General questions',
        'Bug reports'
    ];

    return (
        <div className="text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen pt-12 pb-24 flex flex-col items-center justify-center overflow-visible">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-transparent space-y-2">
                    <div className="animate-fade-in-down">
                        <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full border border-teal-400/30 mb-8 hover-scale">
                            <MessageCircle className="w-5 h-5 text-teal-400 animate-float" />
                            <span className="text-teal-300 font-semibold">Let's Talk</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                            Let's Build
                            <span className="block pb-3 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                Together
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-soft-200 max-w-3xl mx-auto leading-relaxed">
                            Have feedback? Want to collaborate? Let's connect and make Zonavi better.
                        </p>
                    </div>

                    {/* Quick Contact Methods Grid */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
                        <a
                            href="mailto:deepakcsengineer05@gmail.com"
                            className="group glass-effect p-6 rounded-2xl border border-white/10 hover:border-teal-400/50 transition-smooth hover-lift stagger-1"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-smooth shadow-lg">
                                <Mail className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Email Us</h3>
                            <p className="text-sm text-soft-400 group-hover:text-soft-300 transition-smooth">Response within 24 hours</p>
                        </a>

                        <a
                            href="tel:+919345561452"
                            className="group glass-effect p-6 rounded-2xl border border-white/10 hover:border-teal-400/50 transition-smooth hover-lift stagger-2"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-smooth shadow-lg">
                                <Phone className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Call Us</h3>
                            <p className="text-sm text-soft-400 group-hover:text-soft-300 transition-smooth">Mon-Sat, 9 AM - 6 PM IST</p>
                        </a>

                        <div className="group glass-effect p-6 rounded-2xl border border-white/10 hover:border-teal-400/50 transition-smooth hover-lift stagger-3">
                            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-smooth shadow-lg">
                                <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                            <p className="text-sm text-soft-400 group-hover:text-soft-300 transition-smooth">Coimbatore, Tamil Nadu</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Main Content */}
            <section className="relative py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Contact Form - 2/3 width */}
                        <div className="lg:col-span-2" data-animate>
                            <div className="relative glass-effect rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl hover:border-teal-400/30 transition-smooth hover-lift">
                                {/* Background Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                                <div className="relative z-10">
                                    <h2 className="text-4xl font-bold mb-3 animate-fade-in-left">Send Us a Message</h2>
                                    <p className="text-soft-300 mb-12 text-lg animate-fade-in-left stagger-1">
                                        Fill out the form below and we'll get back to you within <span className="text-teal-400 font-semibold">24 hours</span>
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-7">
                                        {/* Name */}
                                        <div className="relative pt-3 animate-fade-in-up stagger-2">
                                            <label
                                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'name' || formData.name
                                                    ? '-top-3 text-sm bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-semibold'
                                                    : 'top-4 text-soft-400'
                                                    }`}
                                            >
                                                Your Name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className="w-full px-4 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-smooth"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="relative pt-3 animate-fade-in-up stagger-3">
                                            <label
                                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'email' || formData.email
                                                    ? '-top-3 text-sm bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-semibold'
                                                    : 'top-4 text-soft-400'
                                                    }`}
                                            >
                                                Email Address <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className="w-full px-4 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-smooth"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="relative pt-3 animate-fade-in-up stagger-4">
                                            <label
                                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'subject' || formData.subject
                                                    ? '-top-3 text-sm bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-semibold'
                                                    : 'top-4 text-soft-400'
                                                    }`}
                                            >
                                                Subject <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('subject')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className="w-full px-4 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-smooth"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="relative pt-3 animate-fade-in-up stagger-5 animate-fade-in-up stagger-5">
                                            <label
                                                className={`absolute left-4 transition-smooth pointer-events-none ${focusedField === 'message' || formData.message
                                                    ? '-top-3 text-sm bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-semibold'
                                                    : 'top-4 text-soft-400'
                                                    }`}
                                            >
                                                Message <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                rows="6"
                                                className="w-full px-4 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-smooth resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs text-soft-500">
                                                {formData.message.length} / 1000
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group w-full px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>

                                        {/* Trust Indicators */}
                                        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Shield className="w-5 h-5 text-teal-400" />
                                                <span className="text-xs text-soft-400">SSL Secure</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-5 h-5 rounded-full border-2 border-purple-400 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-purple-400">P</span>
                                                </div>
                                                <span className="text-xs text-soft-400">Data Privacy</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <MessageCircle className="w-5 h-5 text-blue-400" />
                                                <span className="text-xs text-soft-400">24/7 Support</span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Additional Info Sections - Left Column */}
                            {/* Interactive Map Section */}
                            <div className="mt-12 glass-effect rounded-3xl border border-white/10 overflow-hidden relative group h-[300px] md:h-[400px] hover-lift transition-smooth" data-animate>
                                {/* Map Background (Simulated) */}
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>

                                {/* Location Pin */}
                                <div className="absolute top-[42%] left-[68%] transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-teal-500 rounded-full animate-ping absolute top-0 left-0"></div>
                                        <div className="w-4 h-4 bg-teal-500 rounded-full relative z-10 border-2 border-white shadow-[0_0_20px_rgba(20,184,166,0.5)]"></div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-navy-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-2 pointer-events-none">
                                            Headquarters, India
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-teal-400" />
                                            Based in Coimbatore
                                        </h3>
                                        <p className="text-soft-300 text-sm md:text-base max-w-sm">
                                            Karpagam College of Engineering,<br />
                                            Coimbatore, Tamil Nadu, India
                                        </p>
                                    </div>
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium backdrop-blur-md transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span>Get Directions</span>
                                        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center group-hover/btn:bg-teal-500/30 transition-colors">
                                            <Send className="w-3 h-3 text-teal-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Cards */}
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    data-animate
                                    className="group relative glass-effect rounded-2xl border border-white/10 p-6 hover:bg-white/15 hover:border-teal-400/30 hover-lift transition-smooth"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-grow">
                                            <div className={`p-4 bg-gradient-to-br ${info.color} rounded-xl shadow-lg group-hover:scale-110 transition-smooth animate-float`}>
                                                <info.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold mb-2 text-lg">{info.title}</h3>
                                                <a
                                                    href={info.link}
                                                    className="text-soft-300 hover:text-teal-400 transition-smooth text-sm block mb-2"
                                                >
                                                    {info.content}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Copy Button */}
                                        <button
                                            onClick={() => handleCopy(info.copyText, info.type)}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-smooth opacity-0 group-hover:opacity-100"
                                            aria-label="Copy to clipboard"
                                        >
                                            {copiedInfo === info.type ? (
                                                <Check className="w-4 h-4 text-teal-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-soft-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Social Links */}
                            <div className="glass-effect rounded-2xl border border-white/10 p-6 hover-lift transition-smooth" data-animate>
                                <h3 className="font-bold mb-6 text-lg flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-teal-400 animate-float" />
                                    Follow Us
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            className={`group flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-400/30 transition-smooth hover-scale ${social.bgColor}`}
                                            aria-label={social.label}
                                        >
                                            <social.icon className={`w-6 h-6 transition-smooth ${social.color}`} />
                                            <span className="text-xs text-soft-400 group-hover:text-white transition-smooth">
                                                {social.followers}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="glass-effect rounded-2xl border border-white/10 p-6 hover-lift transition-smooth" data-animate>
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-teal-400" />
                                    What can we help you with?
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {reasons.map((reason, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-soft-300 hover:text-teal-400 transition-smooth cursor-pointer"
                                        >
                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                                            {reason}
                                        </li>
                                    ))}
                                </ul>

                            </div>

                            {/* Response Time */}
                            <div className="relative bg-gradient-to-br from-teal-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-teal-400/30 p-6 overflow-hidden hover-glow transition-smooth" data-animate>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>

                                <div className="relative z-10 text-center">
                                    <div className="inline-flex p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-xl animate-float">
                                        <Clock className="w-8 h-8 text-white animate-pulse-slow" />
                                    </div>
                                    <h4 className="font-bold mb-2 text-lg">Quick Response</h4>
                                    <p className="text-sm text-soft-300">
                                        We typically respond within{' '}
                                        <strong className="text-teal-400">24 hours</strong> on business days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Office Hours */}
            <section className="relative py-20 md:py-32" data-animate>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative glass-effect rounded-3xl border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden hover-lift transition-smooth">
                        {/* Background Pattern */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-start md:items-center">
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 animate-fade-in-left">Office Hours</h2>
                                <p className="text-soft-300 mb-6 md:mb-8 text-base md:text-lg animate-fade-in-left stagger-1">
                                    Our support team is available during these hours to assist you
                                </p>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover-lift transition-smooth animate-fade-in-left stagger-2">
                                        <span className="text-soft-300 font-medium text-sm sm:text-base">Monday - Friday</span>
                                        <span className="font-bold text-teal-400 text-sm sm:text-base">9:00 AM - 6:00 PM IST</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover-lift transition-smooth animate-fade-in-left stagger-3">
                                        <span className="text-soft-300 font-medium text-sm sm:text-base">Saturday</span>
                                        <span className="font-bold text-teal-400 text-sm sm:text-base">10:00 AM - 4:00 PM IST</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover-lift transition-smooth animate-fade-in-left stagger-4">
                                        <span className="text-soft-300 font-medium text-sm sm:text-base">Sunday</span>
                                        <span className="font-bold text-soft-500 text-sm sm:text-base">Closed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-8 md:mt-0">
                                <div className="inline-flex p-6 sm:p-8 md:p-10 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-3xl mb-4 md:mb-6 border border-teal-400/20 animate-float">
                                    <Mail className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-teal-400 animate-scale-in" />
                                </div>
                                <p className="text-soft-300 text-sm sm:text-base md:text-lg animate-fade-in-up stagger-1 px-2">
                                    For urgent matters or general inquiries, email us at
                                </p>
                                <a
                                    href="mailto:deepakcsengineer05@gmail.com"
                                    className="inline-block mt-3 md:mt-4 text-sm sm:text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent hover-scale transition-smooth animate-fade-in-up stagger-2 break-all px-2"
                                >
                                    deepakcsengineer05@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
