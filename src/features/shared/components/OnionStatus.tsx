import { Marker, OnionSquare } from '@Components/icons/Lattice';
import React, { useMemo } from 'react';

import { isOnion } from '@/lib/utils';

export const OnionStatus: React.FC = () => {
    const onOnion = useMemo(() => isOnion(), []);
    const onionUrl = import.meta.env?.VITE_ONION_URL;

    if (onOnion) {
        return (
            <span
                role="status"
                aria-label="Served over the onion edge"
                className="flex h-10 shrink-0 items-center gap-2.5 border border-orange-500/60 px-3"
            >
                <OnionSquare className="h-4 w-4 text-orange-400" />
                <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-300 sm:inline">
                    Onion edge
                </span>
                <Marker size={5} className="bg-emerald-400" />
            </span>
        );
    }

    if (!onionUrl) return null;

    return (
        <a
            href={onionUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the onion version of this site"
            className="flex h-10 shrink-0 items-center gap-2.5 border border-neutral-800 px-3 transition-colors hover:border-orange-500/60"
        >
            <OnionSquare className="h-4 w-4 text-neutral-400" />
            <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300 sm:inline">
                Use onion
            </span>
        </a>
    );
};

export default OnionStatus;
