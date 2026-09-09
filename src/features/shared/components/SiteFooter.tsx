import { CubeMark, Marker } from '@Components/icons/Lattice';
import React from 'react';
import { Link } from 'react-router';

const resources = [
    { label: 'Docs', to: '/swagger' },
    { label: 'Status', to: '/status' },
    { label: 'Roadmap', to: '/roadmap' },
    { label: 'License', to: '/license' },
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
];

export const SiteFooter: React.FC = () => (
    <footer className="relative border-t border-neutral-800 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 lg:px-12">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                    <CubeMark className="h-[18px] w-[18px] text-orange-500" />
                    <span className="font-display text-[15px] font-bold tracking-[0.04em] text-neutral-100">
                        1337.legal
                    </span>
                </div>
                <p className="max-w-[300px] text-xs leading-relaxed text-neutral-500">
                    Secure email identity — disposable aliases sealed with strong encryption. We cannot read your
                    contents.
                </p>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange-400">
                    Bitcoin &amp; Monero accepted
                </span>
            </div>

            <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Resources
                </span>
                <div className="grid grid-cols-3 gap-x-5 gap-y-2.5">
                    {resources.map((r) => (
                        <Link
                            key={r.label}
                            to={r.to}
                            className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-orange-300"
                        >
                            {r.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Build
                </span>
                <p className="flex items-center gap-2.5 font-mono text-[11px] text-neutral-500">
                    <Marker className="bg-amber-400" />
                    Preview build — not production email yet.
                </p>
                <span className="font-mono text-[11px] text-neutral-600">© {new Date().getFullYear()} 1337.legal</span>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
