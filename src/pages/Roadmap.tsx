import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';
import SiteFooter from '@Features/shared/components/SiteFooter';

const Roadmap: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            {/* soft background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-15%] h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.16),transparent_60%)] blur-3xl" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[420px] w-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,115,60,0.12),transparent_70%)] blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-5xl px-6 py-16">
                <div className="mb-8 flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-400/50 bg-neutral-900/60 text-orange-300 backdrop-blur">Roadmap</Badge>
                    <span className="h-px w-24 bg-gradient-to-r from-orange-400/60 to-transparent" />
                </div>
                <h1 className="text-balance font-cal text-4xl leading-tight tracking-tight md:text-5xl">What’s next for 1337.legal</h1>
                <p className="mt-3 max-w-2xl text-neutral-400">We’re open‑sourcing the project, prioritizing audits, and shipping in small, verifiable steps. This page sketches the near‑term direction — details may change as we learn.</p>

                <section className="mt-10 grid gap-6 md:grid-cols-2">
                    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Open Source</CardTitle>
                            <CardDescription>Transparent code and reproducible builds.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-neutral-400">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Public repos for client, extension, and backend modules.</li>
                                <li>Permissive license with clear contributor guidelines.</li>
                                <li>Deterministic builds and signed releases.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Security & Audits</CardTitle>
                            <CardDescription>Independent review before GA.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-neutral-400">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Third‑party cryptography and privacy review.</li>
                                <li>Supply‑chain hardening and SLSA‑style provenance.</li>
                                <li>Public bug bounty with clear disclosure policy.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Product</CardTitle>
                            <CardDescription>Shipping small, useful pieces.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-neutral-400">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Alias lifecycle improvements and better routing rules.</li>
                                <li>PGP features and key management UX.</li>
                                <li>Mobile companion and cross‑device sync.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Infrastructure</CardTitle>
                            <CardDescription>Built for privacy first.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-neutral-400">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Optional transparency log for alias events.</li>
                                <li>Blinded indexes to reduce correlation surface.</li>
                                <li>Multi‑region relays and onion service access.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Community & Operations</CardTitle>
                            <CardDescription>Help shape how we build and ship.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-neutral-400">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Lightweight RFCs for protocol and API changes.</li>
                                <li>Status page, incident write‑ups, and changelogs.</li>
                                <li>Governance doc as scope and contributors grow.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section className="mt-10">
                    <Card className="overflow-hidden border-neutral-800 bg-neutral-900/70 backdrop-blur">
                        <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-medium text-neutral-100">Get involved</p>
                                <p className="text-sm text-neutral-400">Follow progress, open issues, and contribute on GitHub.</p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild className="bg-orange-500 text-neutral-900 hover:bg-orange-400">
                                    <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer">GitHub</a>
                                </Button>
                                <Button asChild variant="outline" className="border-neutral-700 bg-neutral-950/40 hover:border-orange-500/70 hover:text-orange-200">
                                    <Link to="/status">Status</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="mt-4 text-xs text-neutral-500">Timelines and items are subject to change. We’ll update this page as work lands.</p>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
};

export default Roadmap;
