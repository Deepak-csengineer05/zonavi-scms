/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Deep Ocean Breeze Color Palette
                'navy': {
                    50: '#e6eef5',
                    100: '#ccdcea',
                    200: '#99b9d5',
                    300: '#6696c0',
                    400: '#3373ab',
                    500: '#0f2744',  // Navy Blue - Primary
                    600: '#0d2239',
                    700: '#0a1a2b',
                    800: '#07111d',
                    900: '#030910',
                },
                'teal': {
                    50: '#e6f5f5',
                    100: '#ccebeb',
                    200: '#99d7d7',
                    300: '#66c3c3',
                    400: '#4fb0b0',
                    500: '#3d8b8b',  // Misty Teal - Secondary
                    600: '#317070',
                    700: '#255454',
                    800: '#183939',
                    900: '#0c1d1d',
                },
                'soft': {
                    50: '#ffffff',
                    100: '#fafbfc',
                    200: '#f5f7f9',
                    300: '#f0f3f6',  // Soft White - Background
                    400: '#e5e9ed',
                    500: '#d6dce3',
                    600: '#b8c1cc',
                    700: '#9aa5b4',
                    800: '#7c8a9d',
                    900: '#5e6f85',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(15, 39, 68, 0.07), 0 10px 20px -2px rgba(15, 39, 68, 0.04)',
                'card': '0 4px 6px -1px rgba(15, 39, 68, 0.1), 0 2px 4px -2px rgba(15, 39, 68, 0.1)',
                'elevated': '0 20px 25px -5px rgba(15, 39, 68, 0.1), 0 8px 10px -6px rgba(15, 39, 68, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 3s infinite',
                'progress': 'progress 3s ease-in-out forwards',
                'gradient-x': 'gradientX 3s ease infinite',
                'scroll': 'scroll 2s ease-in-out infinite',
            },
            keyframes: {
                progress: {
                    '0%': { width: '0%' },
                    '20%': { width: '10%' },
                    '50%': { width: '40%' },
                    '80%': { width: '80%' },
                    '100%': { width: '100%' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                gradientX: {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                scroll: {
                    '0%': { opacity: '0', transform: 'translateY(0)' },
                    '40%': { opacity: '1' },
                    '80%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}
