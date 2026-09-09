import { CubeMark } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import OnionStatus from '@Features/shared/components/OnionStatus';
import React from 'react';
import { Link } from 'react-router';

const links = [
    { label: 'Docs', to: 'https://api.1337.legal/swagger', external: true },
    { label: 'Status', to: '/status', external: false },
    { label: 'Roadmap', to: '/roadmap', external: false },
    { label: 'GitHub', to: 'https://github.com/1337-legal', external: true },
];

export const SiteNav: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="relative z-20 flex min-h-[71px] items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-3">
            <CubeMark className="h-[22px] w-[22px] text-orange-500" />
            <span className="font-display text-[17px] font-bold tracking-[0.04em] text-neutral-100">1337.legal</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-9">
            <div className="hidden items-center gap-6 lg:flex lg:gap-9">
                {links.map((l) =>
                    l.external ? (
                        <a
                            key={l.label}
                            href={l.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-orange-300"
                        >
                            {l.label}
                        </a>
                    ) : (
                        <Link
                            key={l.label}
                            to={l.to}
                            className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-orange-300"
                        >
                            {l.label}
                        </Link>
                    ),
                )}
            </div>
            <OnionStatus />
            {children ?? (
                <Button asChild size="sm" className="h-10">
                    <Link to="/auth">Get started</Link>
                </Button>
            )}
        </div>
    </div>
);

export default SiteNav;
