// filepath: c:\Users\Sierra\Documents\Projects\1337.legal\Frontend\src\features\auth\components\SectionCard.tsx
import React from 'react';

const SectionCard: React.FC<React.PropsWithChildren<{ title: string; description: string; icon?: React.ReactNode }>> = ({ title, description, icon, children }) => (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6 backdrop-blur transition hover:border-orange-500/40 hover:bg-neutral-900/60">
        <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-300">{icon}</div>
            <div>
                <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            {children}
        </div>
    </div>
);

export default SectionCard;