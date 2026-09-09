import { CubeLock, Marker } from '@Components/icons/Lattice';
import { Panel } from '@Components/ui/panel';
import React from 'react';

const ChipRelay: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M6 6 H18 V18 H6 Z" />
        <path d="M10 3 V6 M14 3 V6 M10 18 V21 M14 18 V21 M3 10 H6 M3 14 H6 M18 10 H21 M18 14 H21" />
    </svg>
);

const MetaDashed: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M3 3 H21 V21 H3 Z" strokeDasharray="4 3" />
        <path d="M8 11 H10 V13 H8 Z" />
        <path d="M14 11 H16 V13 H14 Z" />
    </svg>
);

const posture = [
    {
        icon: ChipRelay,
        title: 'In-Memory Relay',
        body: 'Hot path keeps transient data only in RAM. No request bodies are written to disk on the relay edge.',
        points: [
            'Ephemeral process space only',
            'No spool / queue persistence',
            'Drops derived material after forward',
        ],
    },
    {
        icon: CubeLock,
        title: 'Full Disk Encryption',
        body: 'All backend nodes boot on FDE volumes. Data at rest protected by platform FDE and a locked boot flow.',
        points: ['No plaintext secrets on disk', 'Rotated unlock material', 'Segregated key scopes'],
    },
    {
        icon: MetaDashed,
        title: 'Minimal Metadata',
        body: 'Designed to reduce correlation surface. Only operational counters and health metrics retained.',
        points: ['No content / IP logs', 'Alias life-cycle is user-controlled', 'Planned: verifiable transparency'],
    },
];

export const InfrastructurePostureSection: React.FC = () => (
    <section className="mx-auto max-w-7xl px-6 pt-22 pb-24 lg:px-12">
        <div className="mb-10 flex items-center gap-4">
            <Marker size={10} />
            <h2 className="font-display text-xl font-semibold uppercase tracking-[0.06em] text-neutral-100 md:text-2xl">
                Infrastructure posture
            </h2>
            <span aria-hidden className="h-px flex-grow bg-neutral-800" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posture.map((p) => (
                <Panel key={p.title} className="flex h-full flex-col gap-4 bg-[#141414] p-7">
                    <p.icon className="h-[26px] w-[26px] text-orange-500" />
                    <h3 className="font-display text-lg font-semibold tracking-[0.03em] text-neutral-100">{p.title}</h3>
                    <p className="text-[13px] leading-relaxed text-neutral-400">{p.body}</p>
                    <span aria-hidden className="h-px bg-neutral-800" />
                    <ul className="flex flex-col gap-2.5">
                        {p.points.map((pt) => (
                            <li key={pt} className="flex items-center gap-2.5">
                                <Marker size={5} className="bg-neutral-600" />
                                <span className="font-mono text-[11px] text-neutral-400">{pt}</span>
                            </li>
                        ))}
                    </ul>
                </Panel>
            ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[12.5px] leading-relaxed text-neutral-500">
            Architecture evolves — the roadmap includes optional audited transparency logs and blind index storage, to
            preserve privacy while enabling trust.
        </p>
    </section>
);

export default InfrastructurePostureSection;
