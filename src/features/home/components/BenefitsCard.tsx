import { Boxes } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Button } from '@Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';

import { benefits } from '../constants/constants';

export const BenefitsCard: React.FC = () => (
    <Card className="relative overflow-hidden border-neutral-800 bg-neutral-900/60 backdrop-blur animate-fade-in-up-long shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_18px_-6px_rgba(251,146,60,0.25)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_65%)]">
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-neutral-100 tracking-tight"><Boxes className="h-5 w-5 text-orange-400" /> Why It Matters</CardTitle>
            <CardDescription className="text-[13px] text-neutral-400">Privacy by default — minimal retention, open primitives, user‑controlled keys.</CardDescription>
            <div className="mt-3 h-px w-24 bg-gradient-to-r from-orange-500/70 via-orange-400/40 to-transparent" />
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
            <ol className="space-y-3">
                {benefits.map((b, i) => (
                    <li
                        key={i}
                        className="group relative flex items-start gap-3 rounded-lg border border-neutral-800/70 bg-neutral-950/40 p-3 text-[11px] md:text-xs text-neutral-400 transition hover:border-orange-500/60 hover:bg-neutral-900/60 hover:text-neutral-200"
                    >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-orange-300 ring-1 ring-orange-500/30 group-hover:bg-orange-500/10 group-hover:text-orange-200">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-relaxed pr-2">{b}</span>
                        <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 ring-1 ring-orange-400/0 transition group-hover:opacity-100 group-hover:ring-orange-400/30" />
                    </li>
                ))}
            </ol>
            <Button asChild variant="outline" className="w-full border-neutral-700 bg-neutral-950/40 text-neutral-300 hover:border-orange-500/70 hover:text-orange-200 hover:bg-neutral-900/60">
                <Link to="/auth" aria-label="Learn more about the benefits of using 1337.legal">
                    Learn More
                </Link>
            </Button>
        </CardContent>
    </Card>
);

export default BenefitsCard;
