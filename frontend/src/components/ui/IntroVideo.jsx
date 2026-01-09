import { useState, useRef, useEffect } from 'react';

const IntroVideo = ({ onComplete }) => {
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        // Fallback timer in case video fails or is very short
        const timer = setTimeout(() => {
            if (!isVideoLoaded) {
                // Try to play manually if state logic lags
                if (videoRef.current) {
                    videoRef.current.play().catch(() => onComplete()); // If play fails (e.g. browser policy), complete
                }
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [isVideoLoaded, onComplete]);

    const handleVideoEnd = () => {
        onComplete();
    };

    const handleVideoError = () => {
        console.warn("Video failed to load or play. Skipping intro.");
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onLoadedData={() => setIsVideoLoaded(true)}
                onError={handleVideoError}
            >
                <source src="/intro.mp4" type="video/mp4" />
                {/* Fallback for browsers that don't support video tag (rare) */}
            </video>

            {/* Skip Button (Optional, good UX) */}
            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-full border border-white/20 hover:border-white/50 backdrop-blur-sm"
            >
                Skip Intro
            </button>
        </div>
    );
};

export default IntroVideo;
