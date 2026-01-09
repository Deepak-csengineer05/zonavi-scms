import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => {
            onComplete();
        }, 3000); // 3 seconds splash

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-navy-900 transition-opacity duration-500">
            <div className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-1000 transform ${animate ? 'opacity-100' : 'opacity-0'}`}>

                {/* Full Screen Logo (Cover) */}
                <img
                    src="/logo-secondary.png"
                    alt="ZONAVI"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Loading Bar (Bottom) */}
                <div className="absolute bottom-10 z-10 w-1/3 h-1.5 bg-black/20 dark:bg-white/20 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-progress"></div>
                </div>

            </div>
        </div>
    );
};

export default SplashScreen;
