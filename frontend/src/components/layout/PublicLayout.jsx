import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ArrowUp } from 'lucide-react';

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/faq', label: 'FAQ' },
        { path: '/contact', label: 'Contact' },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-600 via-navy-500 to-teal-600">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-lg'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12 md:h-14">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src="/logo-primary.png"
                                alt="ZONAVI"
                                className="h-10 md:h-12 transition-transform group-hover:scale-105"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2 ml-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-8 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons - Desktop */}
                        <div className="hidden md:flex items-center gap-3 ml-8">
                            <Link
                                to="/login"
                                className="px-3 py-1.5 text-white font-medium hover:bg-white/10 rounded-lg transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                Sign Up Free
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/10 animate-fade-in">
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${location.pathname === link.path
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-2 border-t border-white/10">
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 text-center text-white font-medium hover:bg-white/10 rounded-lg transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-3 text-center bg-white/20 text-white font-medium rounded-lg border border-white/30 hover:bg-white/30 transition-all"
                                >
                                    Sign Up Free
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-12 md:pt-14">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="relative mt-20 bg-navy-900/50 backdrop-blur-lg border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <img src="/logo-primary.png" alt="ZONAVI" className="h-10 mb-4" />
                            <p className="text-soft-300 text-sm leading-relaxed">
                                Zone of Opportunities & Navigation of Vision for Students
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link to="/#features" className="text-soft-300 hover:text-white text-sm transition-colors">Features</Link></li>
                                <li><Link to="/#how-it-works" className="text-soft-300 hover:text-white text-sm transition-colors">How It Works</Link></li>
                                <li><Link to="/register" className="text-soft-300 hover:text-white text-sm transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="text-soft-300 hover:text-white text-sm transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="text-soft-300 hover:text-white text-sm transition-colors">Contact</Link></li>
                                <li><Link to="/faq" className="text-soft-300 hover:text-white text-sm transition-colors">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="mailto:support@zonavi.com" className="text-soft-300 hover:text-white text-sm transition-colors">Email Support</a></li>
                                <li><Link to="/faq" className="text-soft-300 hover:text-white text-sm transition-colors">Help Center</Link></li>
                                <li><a href="#" className="text-soft-300 hover:text-white text-sm transition-colors">Community</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-soft-400 text-sm">
                            © 2026 Zonavi. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-soft-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-soft-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                            <a href="#" className="text-soft-400 hover:text-white text-sm transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
