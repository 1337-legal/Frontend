import { Marker } from '@Components/icons/Lattice';
import React from 'react';

import { features } from '../constants/constants';
import FeatureIcon from './FeatureIcon';

export const FeatureGrid: React.FC = () => (
    <section id="core-surface" className="mx-auto max-w-7xl px-6 pt-24 lg:px-12">
        <div className="mb-10 flex items-center gap-4">
            <Marker size={10} />
            <h2 className="font-display text-xl font-semibold uppercase tracking-[0.06em] text-neutral-100 md:text-2xl">
                Core surface
            </h2>
            <span aria-hidden className="h-px flex-grow bg-neutral-800" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">06 modules</span>
        </div>

        {}
        <div className="chamfer bg-neutral-800 p-px">
            <div className="chamfer-in grid gap-px bg-neutral-800 md:grid-cols-2 lg:grid-cols-3">
                {features.map((f, i) => (
                    <div key={f.title} className="relative flex flex-col gap-4 bg-[#101010] p-7 lg:min-h-[202px]">
                        <span className="absolute right-6 top-6 font-mono text-[11px] tracking-[0.14em] text-neutral-500">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <FeatureIcon icon={f.icon as React.ComponentType<{ className?: string }>} />
                        <h3 className="font-display text-lg font-semibold tracking-[0.02em] text-neutral-100">
                            {f.title}
                        </h3>
                        <p className="text-[13.5px] leading-relaxed text-neutral-400 text-pretty">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeatureGrid;
