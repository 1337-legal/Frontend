import React from 'react';

export const Spark: React.FC<{ className?: string }> = ({ className }) => (
    <span className={`pointer-events-none inline-block h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_14px_-2px_rgba(251,146,60,0.95)] ${className || ''}`}></span>
);

export default Spark;
