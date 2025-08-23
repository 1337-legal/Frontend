import { ShieldCheck } from 'lucide-react';
import React, { Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';

import PrivacyEnvelopeScene from './PrivacyEnvelopeScene';
import Spark from './Spark';

export const PrivacyEnvelopeCard: React.FC = () => (
    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur animate-fade-in-up overflow-hidden">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-100"><ShieldCheck className="h-5 w-5 text-orange-400" /> Blindflare Privacy Envelope</CardTitle>
            <CardDescription>Your data travels opaque.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative">
            <div className="relative h-64 w-full rounded-md ring-1 ring-neutral-800/60 bg-neutral-950/80">
                <Suspense fallback={<div className="flex h-full items-center justify-center text-xs text-neutral-500">Loading secure visualization…</div>}>
                    <PrivacyEnvelopeScene />
                </Suspense>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/90" />
            </div>
            <p className="text-sm text-neutral-400">Instead of sending readable JSON, your app sends an encrypted capsule. We can route and fulfill it — but not inspect its private contents.</p>
            <ul className="space-y-2 text-xs text-neutral-400">
                <li className="flex gap-2"><Spark /> Request body is encrypted before leaving your device.</li>
                <li className="flex gap-2"><Spark /> Edge/CDN providers only see length + timing, never the plaintext.</li>
                <li className="flex gap-2"><Spark /> Passwords are never stored in a form we can recover.</li>
                <li className="flex gap-2"><Spark /> Replies are sealed back the same way.</li>
                <li className="flex gap-2"><Spark /> End‑to‑end PGP forwarding supported & recommended (bring your public key — rollout phase).</li>
            </ul>
            <div className="mt-4 rounded-md bg-neutral-950/70 p-4 text-[11px] leading-relaxed ring-1 ring-neutral-800">
                <p className="text-orange-300 font-mono">ENVELOPE :: SEALED</p>
                <p className="text-neutral-500">ciphertext: 0x8f0c…b7</p>
                <p className="text-neutral-500">visible: size, route</p>
                <p className="text-neutral-500">hidden: alias, intent, password material</p>
            </div>
        </CardContent>
    </Card>
);

export default PrivacyEnvelopeCard;
