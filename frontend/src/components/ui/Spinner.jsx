const Spinner = ({ size = 'md', color = 'teal' }) => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colors = {
        teal: 'border-teal-500',
        navy: 'border-navy-500',
        white: 'border-white',
        gray: 'border-gray-500'
    };

    return (
        <div 
            className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`}
            role="status"
            aria-label="Loading"
        />
    );
};

export default Spinner;
