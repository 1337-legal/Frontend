import {
    Activity, AlertCircle, ArrowLeft, CheckCircle2, Clock, Globe2, Mail, Server
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';

const Status: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-25%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.14),transparent_65%)] blur-3xl" />
            </div>
            <main className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-32 md:pt-32">
                <div className="mb-10 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent" asChild>
                        <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
                    </Button>
                    <Badge variant="outline" className="border-orange-400/40 text-orange-300">Status</Badge>
                </div>
                <header className="mb-8 space-y-3">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 flex items-center gap-2">
                        <Activity className="h-6 w-6 text-orange-400" /> Service Status
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-2xl">
                        This page is not ready yet. Live uptime metrics, historical incidents, latency graphs, and maintenance notices will appear here once implemented.
                    </p>
                    <div className="rounded-md border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-xs flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5" />
                        <span className="text-neutral-300">
                            Placeholder only. All components below default to &quot;Operational&quot; unless manually overridden.
                        </span>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                <Server className="h-4 w-4 text-orange-400" /> API Gateway
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Operational
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">REST + OpenAPI endpoints.</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                <Globe2 className="h-4 w-4 text-orange-400" /> Web App
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Operational
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Frontend delivery & static assets.</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                <Mail className="h-4 w-4 text-orange-400" /> Email Relay
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Operational
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Alias ingress / forwarding pipeline.</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                <Clock className="h-4 w-4 text-orange-400" /> Background Jobs
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Operational
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Queue workers: cleanup, metrics, crypto tasks.</p>
                    </div>
                </section>

                <section className="mt-10 space-y-4">
                    <h2 className="text-sm font-medium text-neutral-300">Legend</h2>
                    <div className="flex flex-wrap gap-3 text-[11px] text-neutral-500">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Operational</span>
                        <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-orange-300"><AlertCircle className="h-3 w-3" /> Degraded</span>
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-red-400"><AlertCircle className="h-3 w-3" /> Outage</span>
                        <span className="inline-flex items-center gap-1 rounded bg-neutral-600/10 px-2 py-0.5 text-neutral-400"><Clock className="h-3 w-3" /> Maintenance</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                        Real incident history & SLA metrics will replace this placeholder. Interim questions: <a href="mailto:status@1337.legal" className="text-orange-300 hover:underline">status@1337.legal</a>.
                    </p>
                </section>
            </main>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
    );
};

export default Status;
