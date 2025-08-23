import { Boxes } from 'lucide-react';
import React from 'react';

import { Button } from '@Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';

import { benefits } from '../constants/constants';

export const BenefitsCard: React.FC = () => (
    <Card className="border-neutral-800 bg-neutral-900/70 backdrop-blur animate-fade-in-up-long">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-100"><Boxes className="h-5 w-5 text-orange-400" /> Why It Matters</CardTitle>
            <CardDescription>Privacy by default.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
            <ol className="space-y-3">
                {benefits.map((b, i) => (
                    <li key={i} className="flex gap-3 rounded-md border border-neutral-800/70 bg-neutral-950/40 p-3 text-xs text-neutral-400 transition hover:border-orange-500/50 hover:text-neutral-300">
                        <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_0_2px_rgba(255,255,255,0.05)]" />
                        <span>{b}</span>
                    </li>
                ))}
            </ol>
            <Button variant="outline" className="w-full border-neutral-700 bg-neutral-950/40 text-neutral-300 hover:border-orange-500/60 hover:text-orange-200">Learn More</Button>
        </CardContent>
    </Card>
);

export default BenefitsCard;
