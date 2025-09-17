import React from 'react';

export const Spark: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 12 }) => (
    <span
        className={`inline-flex items-center justify-center pointer-events-none ${className}`}
        style={{ width: size, height: size }}
    >
        <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)] animate-pulse"
            aria-hidden="true"
        >
            <path
                fill="currentColor"
                d="M12 2.2l1.6 5.1 5.2 1.6-5.2 1.6-1.6 5.2-1.6-5.2L5.2 9l5.2-1.6L12 2.2z"
                opacity=".9"
            />
            <path
                fill="currentColor"
                d="M12 5.5l1 3.1 3.2 1-3.2 1-1 3.2-1-3.2-3.2-1 3.2-1 1-3.1z"
            />
        </svg>
    </span>
);

export default Spark;
