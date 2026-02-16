import { useState, useEffect } from 'react';
import {
    Search, ChevronDown, Sparkles, HelpCircle,
    Users, Building2, Briefcase, Code, MessageCircle,
    ArrowRight, Mail
} from 'lucide-react';

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState([0]); // First item open by default

    // Smooth scroll animations
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

    const categories = [
        { id: 'all', label: 'All Questions', icon: Sparkles, count: 20 },
        { id: 'students', label: 'For Students', icon: Users, count: 7 },
        { id: 'admins', label: 'For Colleges', icon: Building2, count: 4 },
        { id: 'employers', label: 'For Employers', icon: Briefcase, count: 4 },
        { id: 'technical', label: 'Technical', icon: Code, count: 5 }
    ];

    const faqs = [
        {
            category: 'students',
            question: 'Who built Zonavi?',
            answer: 'Zonavi was founded by Deepak Saravanakumar, a Third Year Computer Science student at Karpagam College of Engineering, Coimbatore. Built with the MERN stack and modern technologies, Zonavi is a vision to transform how colleges, students, and companies collaborate by addressing the disconnect between student aspirations and placement training.'
        },
        {
            category: 'students',
            question: 'How do I create an account on Zonavi?',
            answer: 'Simply click on "Sign Up" button, choose "Student" role, fill in your academic details (name, email, branch, CGPA, year), and you\'re ready to go! Registration takes less than a minute and is completely free.'
        },
        {
            category: 'students',
            question: 'Is Zonavi really free for students?',
            answer: 'Yes, absolutely! Zonavi is 100% free for students forever. We believe every student deserves access to quality career management tools. You get unlimited resume builds, job tracking, skill analytics, and all features at no cost.'
        },
        {
            category: 'students',
            question: 'How do I build my resume using Zonavi?',
            answer: 'Navigate to "Resume Builder" from the sidebar. Choose from 4 professional templates (Classic, Modern, Professional, Minimal). Fill in your details or sync from your profile. Preview in real-time and download as PDF instantly. You can create unlimited versions!'
        },
        {
            category: 'students',
            question: 'What is Career Score and how is it calculated?',
            answer: 'Career Score is a gamified metric that reflects your profile strength. It\'s calculated based on: Projects, Skills, Certificates, Job applications, Internships, and CGPA. Higher scores help track your growth and improvement over time!'
        },
        {
            category: 'students',
            question: 'How do I track my job applications?',
            answer: 'Go to "My Applications" page. You can track both system applications (jobs applied through Zonavi) and manual applications (external jobs). Track status changes (Applied → Shortlisted → Interviewing → Offered → Accepted), add notes, and get real-time notifications.'
        },
        {
            category: 'students',
            question: 'Can I apply for jobs from multiple companies?',
            answer: 'Yes! There\'s no limit. Browse jobs in "Browse Jobs" section, filter by location, salary, job type, and apply instantly. Your profile and resume are automatically shared with employers when you apply.'
        },
        {
            category: 'admins',
            question: 'How can colleges use Zonavi?',
            answer: 'Colleges get a dedicated admin portal with powerful features: Bulk import students via CSV, view placement analytics and rankings, manage job postings, send announcements to all students, and track placement rates by branch/year. Contact us for institutional setup.'
        },
        {
            category: 'admins',
            question: 'Can we import existing student data?',
            answer: 'Yes! Use the "Import Data" feature. Upload a CSV file with student details (name, email, branch, roll number, CGPA, year) and we\'ll bulk create accounts. Students receive email invitations to complete their profiles. Supports 1000+ students at once.'
        },
        {
            category: 'admins',
            question: 'How do we monitor placement statistics?',
            answer: 'The "Rankings & Stats" dashboard provides: Branch-wise placement rates, top performers by career score, company-wise hiring data, application status distribution, and exportable reports. All visualized with interactive charts.'
        },
        {
            category: 'admins',
            question: 'Can we post jobs on behalf of companies?',
            answer: 'Yes! Admins can create job postings in "Job Management". Enter company details, job requirements, salary range, and application deadline. All students get notified instantly. You can also approve/reject employer-posted jobs.'
        },
        {
            category: 'employers',
            question: 'How do employers hire through Zonavi?',
            answer: 'Register as an Employer → Complete your company profile → Post job openings → Receive applications → Use our Kanban board to move candidates through stages (Applied → Under Review → Shortlisted → Offered → Accepted/Rejected). Streamlined hiring in one place!'
        },
        {
            category: 'employers',
            question: 'Is there a fee to post jobs?',
            answer: 'We operate on a "Pay Per Hire" model for employers. Posting jobs is FREE. You only pay when you successfully hire a candidate through our platform. Contact our sales team for custom pricing based on your hiring volume.'
        },
        {
            category: 'employers',
            question: 'What is the Kanban Applicant Tracking System?',
            answer: 'It\'s a drag-and-drop board (like Trello) to manage candidates. Create columns for each hiring stage, drag applicant cards between stages, add notes, schedule interviews, and collaborate with your team. Students get real-time notifications on status changes.'
        },
        {
            category: 'employers',
            question: 'Can we search for candidates with specific skills?',
            answer: 'Yes! Use advanced filters to search students by: Skills (e.g., React, Python), CGPA range, Branch (CS, IT, etc.), Year of graduation, Location preference, and Career score. AI-powered matching also suggests top candidates for each job posting.'
        },
        {
            category: 'technical',
            question: 'What browsers are supported?',
            answer: 'Zonavi works on all modern browsers: Chrome (recommended), Firefox, Safari, Edge, and Opera. For the best experience, use the latest version of your browser. Mobile browsers are also fully supported.'
        },
        {
            category: 'technical',
            question: 'Is my data secure on Zonavi?',
            answer: 'Absolutely! We use industry-standard security: 256-bit SSL encryption for data transfer, JWT tokens for authentication, password hashing with bcrypt, secure MongoDB Atlas hosting, and regular security audits. We never share your personal data without consent.'
        },
        {
            category: 'technical',
            question: 'Can I use Zonavi on mobile devices?',
            answer: 'Yes! Zonavi is fully responsive and works seamlessly on smartphones and tablets. We also have progressive web app (PWA) support - you can "Install" Zonavi from your browser for an app-like experience without downloading from stores.'
        },
        {
            category: 'technical',
            question: 'What file formats are supported for resume upload?',
            answer: 'Currently, Zonavi generates resumes automatically from your profile data in PDF format. For certificates and documents, we accept: PDF, JPG, JPEG, PNG (max 5MB per file). All uploads are stored securely on our servers.'
        },
        {
            category: 'students',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page → Enter your registered email → Check your inbox for a reset link (valid for 10 minutes) → Click the link and create a new password. If you don\'t receive the email, check spam folder or contact support.'
        },
        {
            category: 'students',
            question: 'Can I delete my account?',
            answer: 'Yes. Go to Profile Settings → Account Section → Delete Account. Note: This action is permanent and cannot be undone. All your data (profile, applications, resumes) will be permanently deleted. Export your data before deleting if needed.'
        },
        {
            category: 'technical',
            question: 'What if I encounter a bug or issue?',
            answer: 'We\'re here to help! Contact us via: Email (support@zonavi.com), or use the "Contact" page on our website. Provide details about the issue, your browser/device, and steps to reproduce. We typically respond within 24 hours.'
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleItem = (index) => {
        setOpenItems(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:pt-8 md:pb-32" data-animate>
                    <div className="inline-flex items-center gap-2 bg-teal-500/10 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-400/30 mb-8 hover:scale-105 transition-transform">
                        <HelpCircle className="w-5 h-5 text-teal-400" />
                        <span className="text-teal-300 font-semibold">Help Center</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Frequently Asked
                        <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-soft-200 mb-12 max-w-3xl mx-auto">
                        Find answers to common questions about Zonavi
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-3xl mx-auto group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-soft-400 group-focus-within:text-teal-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for answers... (e.g., 'resume builder', 'career score')"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl text-white text-lg placeholder-soft-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-xl focus:shadow-teal-500/20"
                        />
                        {searchTerm && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-soft-400">
                                {filteredFAQs.length} result{filteredFAQs.length !== 1 && 's'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories & FAQs */}
            <section className="relative py-12" data-animate>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-4 mb-16 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${activeCategory === category.id
                                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-xl shadow-teal-500/30 scale-105'
                                        : 'bg-white/5 backdrop-blur-lg text-soft-300 border border-white/20 hover:bg-white/10 hover:border-teal-400/30 hover:scale-105'
                                    }`}
                            >
                                <category.icon className="w-5 h-5" />
                                <span>{category.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeCategory === category.id
                                        ? 'bg-white/20'
                                        : 'bg-white/10'
                                    }`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* FAQ Items */}
                    {filteredFAQs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFAQs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-teal-400/30 transition-all duration-300 ${openItems.includes(index) ? 'shadow-xl shadow-teal-500/10' : ''
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left group/button"
                                    >
                                        <span className="text-lg md:text-xl font-bold pr-4 group-hover/button:text-teal-300 transition-colors flex-grow">
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center group-hover/button:bg-teal-500/30 transition-all ${openItems.includes(index) ? 'rotate-180' : ''
                                            }`}>
                                            <ChevronDown className="w-5 h-5 text-teal-400" />
                                        </div>
                                    </button>

                                    {openItems.includes(index) && (
                                        <div className="px-8 pb-6 animate-fade-in-up">
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-soft-300 leading-relaxed text-base md:text-lg">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Decorative corner */}
                                    {openItems.includes(index) && (
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-tl-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-16 max-w-2xl mx-auto">
                                <div className="inline-flex p-8 bg-white/5 rounded-3xl mb-6">
                                    <Search className="w-20 h-20 text-soft-400" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">No results found</h3>
                                <p className="text-soft-300 text-lg mb-8">
                                    Try different keywords or browse all categories
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveCategory('all');
                                    }}
                                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
                                >
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Still Need Help CTA */}
            <section className="relative py-14" data-animate>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl text-center overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 left-0 w-56 h-56 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="inline-flex p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl mb-5 shadow-xl hover:scale-105 transition-transform">
                                <MessageCircle className="w-12 h-10 text-white" />
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                Still Need
                                <span className="block bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                                    Help?
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl text-soft-300 mb-12 max-w-2xl mx-auto">
                                Can't find what you're looking for? Our team is here to assist you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <a
                                    href="/contact"
                                    className="group px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    Contact Support
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="mailto:deepakcsengineer05@gmail.com"
                                    className="group px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-teal-400/50 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <Mail className="w-5 h-5" />
                                    Email Us
                                </a>
                            </div>

                            {/* Trust Line */}
                            <div className="mt-10 flex items-center justify-center gap-2 text-soft-400">
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                                <span>Average response time: 24 hours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
