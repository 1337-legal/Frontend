import { ArrowLeft, ShieldCheck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import SiteFooter from '@Features/shared/components/SiteFooter';

const Privacy: React.FC = () => {
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
                    <Badge variant="outline" className="border-orange-400/40 text-orange-300">Privacy</Badge>
                </div>
                <header className="mb-10 space-y-3">
                    <h1 className="font-cal text-4xl leading-tight md:text-5xl">Privacy First <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">No Hidden Harvest</span></h1>
                    <p className="max-w-2xl text-neutral-400 text-lg">We collect the minimum required to operate blind, end‑to‑end alias issuance. No ad tech, fingerprinting, third‑party trackers, or data resale — ever.</p>
                </header>
                <section className="space-y-8 text-sm leading-relaxed text-neutral-300">
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 flex items-center gap-2 text-neutral-200 font-semibold text-base"><ShieldCheck className="h-4 w-4 text-orange-300" /> Core Principles</h2>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                            <li>Open source cryptographic flows (reviewable, reproducible builds).</li>
                            <li>Blindflare envelope: server never sees plaintext alias generation intent.</li>
                            <li>Zero analytics beacons; only coarse, ephemeral operational metrics (aggregate process counters in RAM) — not persisted.</li>
                            <li>No profiling: no cross‑site tracking, no device graph, no behavioral enrichment.</li>
                            <li>Keys generated client‑side; secret material never transmitted unencrypted.</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">Data We (Avoid/Minimize)</h2>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                            <li>No real email harvesting; aliases are deterministic / random words only.</li>
                            <li>No content logging: request bodies inside encrypted transport envelope only in memory for processing then released.</li>
                            <li>No IP retention beyond transient reverse‑proxy access logs with truncated addresses (rotated quickly).</li>
                            <li>No cookies for tracking; only session token (JWT) if you authenticate — short TTL, revocable.</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">Limited Operational Data</h2>
                        <p className="text-neutral-400">To resist abuse (spam flooding, brute force) we may retain rolling counters (alias creations per key, failed auth attempts) keyed to hashed public keys. No linkage to a person, and hashes rotate.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">Your Controls</h2>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                            <li>Revoke: regenerate keypair (invalidates previous session material).</li>
                            <li>Export: inspect local storage / config file; nothing server‑side to export.</li>
                            <li>Erase: delete local keys; server retains no user profile to purge.</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">Third Parties</h2>
                        <p className="text-neutral-400">We avoid third‑party SDKs. Hosting & edge (e.g. DNS / CDN) providers see standard network metadata only. No sharing with advertisers or data brokers.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">Changes</h2>
                        <p className="text-neutral-400">Material changes require a bump in this page with a dated changelog entry. You can diff in Git — transparency by design.</p>
                    </div>
                    <p className="text-xs text-neutral-500">Alpha build. Questions: <a href="mailto:privacy@1337.legal" className="text-orange-300 hover:underline">privacy@1337.legal</a>. Last updated {new Date().toISOString().split('T')[0]}.</p>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
};

export default Privacy;
