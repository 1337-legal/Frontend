import { Lock, Shield, TerminalSquare } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';
import { Separator } from '@Components/ui/separator';

import Spark from './Spark';

export const InfrastructurePostureSection: React.FC = () => (
    <section className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-10 flex items-center gap-3">
            <Spark />
            <h2 className="text-xl font-semibold tracking-tight text-neutral-200 md:text-2xl">Infrastructure Posture</h2>
            <Separator className="flex-1 bg-neutral-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                <CardHeader className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-neutral-100"><TerminalSquare className="h-4 w-4 text-orange-400" /> In‑Memory Relay</CardTitle>
                    <CardDescription className="text-neutral-400">Hot path keeps transient data only in RAM.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-neutral-500 space-y-2">
                    <p>No request bodies are written to disk on relay edge.</p>
                    <ul className="space-y-1">
                        <li className="flex gap-2"><Spark /> Ephemeral process space only</li>
                        <li className="flex gap-2"><Spark /> No spool / queue persistence</li>
                        <li className="flex gap-2"><Spark /> Drops derived material after forward</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                <CardHeader className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-neutral-100"><Lock className="h-4 w-4 text-orange-400" /> Full Disk Encryption</CardTitle>
                    <CardDescription className="text-neutral-400">All backend nodes boot on FDE volumes.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-neutral-500 space-y-2">
                    <p>Data at rest protected by platform FDE + locked boot flow.</p>
                    <ul className="space-y-1">
                        <li className="flex gap-2"><Spark /> No plaintext secrets on disk</li>
                        <li className="flex gap-2"><Spark /> Rotated unlock material</li>
                        <li className="flex gap-2"><Spark /> Segregated key scopes</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur">
                <CardHeader className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-neutral-100"><Shield className="h-4 w-4 text-orange-400" /> Minimal Metadata</CardTitle>
                    <CardDescription className="text-neutral-400">Designed to reduce correlation surface.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-neutral-500 space-y-2">
                    <p>Only operational counters & health metrics retained.</p>
                    <ul className="space-y-1">
                        <li className="flex gap-2"><Spark /> No content / IP logs</li>
                        <li className="flex gap-2"><Spark /> Alias life-cycle is user‑controlled</li>
                        <li className="flex gap-2"><Spark /> Planned: verifiable transparency</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div className="mt-10 text-center">
            <p className="mx-auto max-w-2xl text-xs text-neutral-500">Architecture evolves — roadmap includes optional audited transparency logs and blind index storage to preserve privacy while enabling trust.</p>
        </div>
    </section>
);

export default InfrastructurePostureSection;
