import React, { useEffect, useRef } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@Components/ui/card';
import { Separator } from '@Components/ui/separator';

import { features } from '../constants/constants';
import FeatureIcon from './FeatureIcon';
import Spark from './Spark';
import ThreeCardOrb from './ThreeCardOrb';

function Floating({ index, children }: { index: number; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        let raf = 0;
        const t0 = performance.now();
        const rand = (seed: number, a: number, b: number) => {
            const x = Math.sin(seed * 12.9898) * 43758.5453;
            const frac = x - Math.floor(x);
            return a + frac * (b - a);
        };
        const amplitudeX = rand(index + 1, 2, 8);
        const amplitudeY = rand(index + 2, 2, 8);
        const rotAmp = rand(index + 3, 0.2, 1.1);
        const freq1 = rand(index + 4, 0.2, 0.6);
        const freq2 = rand(index + 5, 0.15, 0.5);
        const freqRot = rand(index + 6, 0.1, 0.3);
        const phase1 = rand(index + 7, 0, Math.PI * 2);
        const phase2 = rand(index + 8, 0, Math.PI * 2);
        const phaseRot = rand(index + 9, 0, Math.PI * 2);
        const loop = (now: number) => {
            const t = (now - t0) / 1000;
            const dx = Math.sin(t * freq1 + phase1) * amplitudeX;
            const dy = Math.cos(t * freq2 + phase2) * amplitudeY;
            const rz = Math.sin(t * freqRot + phaseRot) * rotAmp;
            const el = ref.current;
            if (el) {
                el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotateZ(${rz.toFixed(2)}deg)`;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [index]);
    return <div ref={ref} className="will-change-transform">{children}</div>;
}

export const FeatureGrid: React.FC = () => (
    <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-center gap-3">
            <Spark />
            <h2 className="text-xl font-semibold tracking-tight text-neutral-200 md:text-2xl">Core Surface</h2>
            <Separator className="flex-1 bg-neutral-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
                <Floating key={f.title} index={i}>
                    <Card
                        className="group relative overflow-hidden border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition hover:border-orange-500/50 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_8px_30px_-8px_rgba(251,146,60,0.4)] opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${80 * i}ms` }}
                    >
                        {/* Three.js animated background */}
                        <div className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90">
                            <ThreeCardOrb className="absolute inset-0" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                        </div>

                        <CardHeader className="relative space-y-3">
                            <div className="relative z-10 inline-flex">
                                <FeatureIcon icon={f.icon as React.ComponentType<{ className?: string }>} />
                            </div>
                            <CardTitle className="relative z-10 text-lg font-medium text-neutral-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">{f.title}</CardTitle>
                            <CardDescription className="relative z-10 text-neutral-300">{f.desc}</CardDescription>
                        </CardHeader>
                    </Card>
                </Floating>
            ))}
        </div>
    </section>
);

export default FeatureGrid;
