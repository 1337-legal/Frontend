import { Marker } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import React from 'react';
import { Link } from 'react-router';

import { benefits } from '../constants/constants';

export const BenefitsCard: React.FC = () => (
    <Panel className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-3">
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="text-orange-500"
                aria-hidden="true"
            >
                <path d="M3 3 H10 V10 H3 Z" />
                <path d="M14 3 H21 V10 H14 Z" />
                <path d="M3 14 H10 V21 H3 Z" />
                <path d="M14 14 H21 V21 H14 Z" />
            </svg>
            <h3 className="font-display text-xl font-semibold uppercase tracking-[0.04em] text-neutral-100">
                Why it matters
            </h3>
        </div>

        <p className="text-sm leading-relaxed text-neutral-400">
            Privacy by default — minimal retention, open primitives, user-controlled keys.
        </p>

        <ol className="flex flex-col gap-px border border-neutral-800 bg-neutral-800">
            {benefits.map((b, i) => (
                <li key={b} className="flex items-start gap-3.5 bg-[#0d0d0d] px-4 py-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#1c1c1c] font-mono text-[10px] font-semibold text-orange-300">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] leading-relaxed text-neutral-400">{b}</span>
                </li>
            ))}
        </ol>

        <Button asChild variant="outline" className="w-full">
            <Link to="/auth" aria-label="Learn more about the benefits of using 1337.legal">
                <Marker className="bg-orange-500" /> Learn more
            </Link>
        </Button>
    </Panel>
);

export default BenefitsCard;
