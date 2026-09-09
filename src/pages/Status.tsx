import { Marker } from '@Components/icons/Lattice';
import { Panel } from '@Components/ui/panel';
import PageShell from '@Features/shared/components/PageShell';
import { AlertCircle, Clock, Globe2, Mail, Server } from 'lucide-react';
import React from 'react';

const components = [
    { icon: Server, name: 'API Gateway', desc: 'REST + OpenAPI endpoints.' },
    { icon: Globe2, name: 'Web App', desc: 'Frontend delivery & static assets.' },
    { icon: Mail, name: 'Email Relay', desc: 'Alias ingress / forwarding pipeline.' },
    { icon: Clock, name: 'Background Jobs', desc: 'Queue workers: cleanup, metrics, crypto tasks.' },
];

const legend = [
    {
        label: 'Operational',
        color: 'bg-emerald-400',
        text: 'text-emerald-400',
        border: 'border-emerald-400',
    },
    {
        label: 'Degraded',
        color: 'bg-orange-500',
        text: 'text-orange-300',
        border: 'border-orange-500',
    },
    { label: 'Outage', color: 'bg-red-400', text: 'text-red-400', border: 'border-red-400' },
    {
        label: 'Maintenance',
        color: 'bg-neutral-500',
        text: 'text-neutral-400',
        border: 'border-neutral-700',
    },
];

const Status: React.FC = () => (
    <PageShell
        label="Status"
        title="Service status"
        intro="This page is not ready yet. Live uptime metrics, historical incidents, latency graphs, and maintenance notices will appear here once implemented."
    >
        <div className="flex flex-col gap-8">
            <div className="flex items-start gap-3.5 border-l-2 border-orange-500 bg-orange-500/5 px-5 py-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="text-sm leading-relaxed text-neutral-300">
                    Placeholder only. All components below default to &quot;Operational&quot; unless manually
                    overridden.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {components.map((c) => (
                    <Panel key={c.name} className="flex flex-col gap-3 bg-[#0d0d0d] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2.5">
                                <c.icon className="h-4 w-4 text-orange-500" />
                                <span className="font-display text-base font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                    {c.name}
                                </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-2 border border-emerald-400 px-2.5 py-1">
                                <Marker size={5} className="bg-emerald-400" />
                                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                                    Operational
                                </span>
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-500">{c.desc}</p>
                    </Panel>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Marker size={8} />
                    <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-neutral-100">
                        Legend
                    </h2>
                    <span aria-hidden className="h-px flex-grow bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {legend.map((l) => (
                        <span key={l.label} className={`flex items-center gap-2 border ${l.border} px-2.5 py-1`}>
                            <Marker size={5} className={l.color} />
                            <span
                                className={`font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${l.text}`}
                            >
                                {l.label}
                            </span>
                        </span>
                    ))}
                </div>
                <p className="text-xs leading-relaxed text-neutral-500">
                    Real incident history and SLA metrics will replace this placeholder. Interim questions:{' '}
                    <a href="mailto:status@1337.legal" className="text-orange-400 hover:text-orange-300">
                        status@1337.legal
                    </a>
                    .
                </p>
            </div>
        </div>
    </PageShell>
);

export default Status;
