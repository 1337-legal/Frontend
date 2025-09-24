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
                <Card
                    className="group relative overflow-hidden border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition hover:border-orange-500/50 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_8px_30px_-8px_rgba(251,146,60,0.4)] opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${80 * i}ms` }}
                >
                    <CardHeader className="relative space-y-3">
                        <div className="relative z-10 inline-flex">
                            <FeatureIcon icon={f.icon as React.ComponentType<{ className?: string }>} />
                        </div>
                        <CardTitle className="relative z-10 text-lg font-medium text-neutral-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">{f.title}</CardTitle>
                        <CardDescription className="relative z-10 text-neutral-300">{f.desc}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </section>
);

export default FeatureGrid;
