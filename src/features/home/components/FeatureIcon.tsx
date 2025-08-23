import React from 'react';

export const FeatureIcon: React.FC<{ icon: React.ComponentType<{ className?: string }>; className?: string }> = ({ icon: Icon, className }) => (
    <div className={`h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 ring-1 ring-inset ring-orange-500/40 text-orange-300 ${className || ''}`}>
        <Icon className="h-6 w-6" />
    </div>
);

export default FeatureIcon;
