import { Marker } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import PageShell, { Bullets } from '@Features/shared/components/PageShell';
import React from 'react';
import { Link } from 'react-router';

const tracks = [
    {
        title: 'Open source',
        desc: 'Transparent code and reproducible builds.',
        items: [
            'Public repos for client and backend modules, plus the extension once it is released.',
            'Permissive license with clear contributor guidelines.',
            'Deterministic builds and signed releases.',
        ],
    },
    {
        title: 'Security & audits',
        desc: 'Independent review before GA.',
        items: [
            'Third-party cryptography and privacy review.',
            'Supply-chain hardening and SLSA-style provenance.',
            'Public bug bounty with clear disclosure policy.',
        ],
    },
    {
        title: 'Product',
        desc: 'Shipping small, useful pieces.',
        items: [
            'Alias lifecycle improvements and better routing rules.',
            'PGP features and key management UX.',
            'Mobile companion and cross-device sync.',
        ],
    },
    {
        title: 'Infrastructure',
        desc: 'Built for privacy first.',
        items: [
            'Optional transparency log for alias events.',
            'Blinded indexes to reduce correlation surface.',
            'Multi-region relays and onion service access.',
        ],
    },
    {
        title: 'Community & operations',
        desc: 'Help shape how we build and ship.',
        items: [
            'Lightweight RFCs for protocol and API changes.',
            'Status page, incident write-ups, and changelogs.',
            'Governance doc as scope and contributors grow.',
        ],
    },
];

const Roadmap: React.FC = () => (
    <PageShell
        label="Roadmap"
        title="What's next"
        accent="For 1337.legal"
        intro="We're open-sourcing the project, prioritizing audits, and shipping in small, verifiable steps. This page sketches the near-term direction — details may change as we learn."
    >
        <div className="flex flex-col gap-8">
            <div className="grid gap-5 md:grid-cols-2">
                {tracks.map((t, i) => (
                    <Panel
                        key={t.title}
                        className="flex h-full flex-col gap-4 bg-[#0d0d0d] p-6"
                        frameClassName={i === tracks.length - 1 ? 'md:col-span-2' : undefined}
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#1c1c1c] font-mono text-[10px] font-semibold text-orange-300">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                {t.title}
                            </h2>
                        </div>
                        <p className="text-sm text-neutral-400">{t.desc}</p>
                        <span aria-hidden className="h-px bg-neutral-800" />
                        <div className="text-sm leading-relaxed text-neutral-400">
                            <Bullets items={t.items} />
                        </div>
                    </Panel>
                ))}
            </div>

            <Panel ticks className="flex flex-col items-start justify-between gap-5 p-7 md:flex-row md:items-center">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Marker size={8} />
                        <h2 className="font-display text-xl font-semibold uppercase tracking-[0.04em] text-neutral-100">
                            Get involved
                        </h2>
                    </div>
                    <p className="text-sm text-neutral-400">Follow progress, open issues, and contribute on GitHub.</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild>
                        <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/status">Status</Link>
                    </Button>
                </div>
            </Panel>

            <p className="font-mono text-[11px] text-neutral-500">
                Timelines and items are subject to change. We&apos;ll update this page as work lands.
            </p>
        </div>
    </PageShell>
);

export default Roadmap;
