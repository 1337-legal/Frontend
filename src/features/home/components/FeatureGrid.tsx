import React from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';
import { Separator } from '@Components/ui/separator';

import { features } from '../constants/constants';
import FeatureIcon from './FeatureIcon';
import Spark from './Spark';

export const FeatureGrid: React.FC = () => (
    <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-center gap-3">
            <Spark />
            <h2 className="text-xl font-semibold tracking-tight text-neutral-200 md:text-2xl">Core Surface</h2>
            <Separator className="flex-1 bg-neutral-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
                <Card key={f.title} className="group relative border-neutral-800 bg-neutral-900/60 backdrop-blur transition hover:border-orange-500/50 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_8px_30px_-8px_rgba(251,146,60,0.4)] opacity-0 animate-fade-in-up" style={{ animationDelay: `${80 * i}ms` }}>
                    <CardHeader className="space-y-3">
                        <FeatureIcon icon={f.icon} />
                        <CardTitle className="text-lg font-medium text-neutral-100">{f.title}</CardTitle>
                        <CardDescription className="text-neutral-400">{f.desc}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </section>
);

export default FeatureGrid;
