import React from 'react';

export const FeatureIcon: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    className?: string;
}> = ({ icon: Icon, className }) => <Icon className={`h-[30px] w-[30px] text-orange-500 ${className || ''}`} />;

export default FeatureIcon;
